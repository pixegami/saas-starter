import time
import os

from api_utils import ApiHandler, ApiException, ApiDatabase
from base.input_validator import InputValidator
from base.membership_status import MembershipStatus
from base.auth_exceptions import AuthExceptions
from base.user import User


class AuthHandler(ApiHandler):

    EXPIRY_MINUTES = 60
    EXPIRY_24_HOURS = 86400
    MAX_SIGN_IN_ATTEMPTS = 5

    SK_CONSECUTIVE_FAILED_SIGN_IN_ATTEMPTS = "CONSECUTIVE_FAILED_SIGN_IN_ATTEMPTS"

    def __init__(self):
        super()

        # Environment load once.
        self.jwt_hash_key = os.getenv("AUTH_SECRET", "")

        # Validators.
        self.validator: InputValidator = InputValidator()

        # Set up the user database table.
        self.user_database: ApiDatabase = ApiDatabase.from_env("TABLE_NAME")
        self.user_database_email_index = self.user_database.from_index(
            "email_index", "email"
        )

    def put_sign_in_attempt_failure(self, key: str, user: str, attempt: int):

        item = {
            "pk": key,
            "sk": self.SK_CONSECUTIVE_FAILED_SIGN_IN_ATTEMPTS,
            "attempt": int(attempt),
            "last_activity": int(time.time()),
            "next_attempt_time": int(time.time())
            + self._get_sign_in_cooldown_expiry_seconds(attempt),
        }

        item["expiry_time"] = int(time.time() + self.EXPIRY_24_HOURS)
        return self.get_user_table().put_item(Item=item)

    def get_sign_in_attempt_failures(self, key: str):
        table = self.get_user_table()
        response = table.get_item(
            Key={"pk": key, "sk": self.SK_CONSECUTIVE_FAILED_SIGN_IN_ATTEMPTS}
        )

        if "Item" not in response:
            return 0, 0

        item = response["Item"]
        return int(item["attempt"]), int(item["next_attempt_time"])

    def _get_sign_in_cooldown_expiry_seconds(self, attempts: int):
        if attempts < self.MAX_SIGN_IN_ATTEMPTS:
            return 0
        return self.EXPIRY_24_HOURS

    def update_user_verification(self, key: str):
        return self.get_user_table().update_item(
            Key={"pk": key, "sk": "CREDENTIALS"},
            UpdateExpression="SET verified = :v1",
            ExpressionAttributeValues={
                ":v1": True,
            },
        )

    def update_user_password(self, key: str, hashed_password: str):
        return self.get_user_table().update_item(
            Key={"pk": key, "sk": "CREDENTIALS"},
            UpdateExpression="SET hashed_password = :v1",
            ExpressionAttributeValues={
                ":v1": hashed_password,
            },
        )

    def update_user_membership(self, key: str, new_expiry_time: int):
        return self.get_user_table().update_item(
            Key={"pk": key, "sk": "CREDENTIALS"},
            UpdateExpression="SET membership_expiry_time = :v1, auto_renew = :v2",
            ExpressionAttributeValues={":v1": new_expiry_time, ":v2": True},
        )

    def update_user_auto_renew(self, customer_id: str, active: bool):
        item = self.get_item_from_gsi(
            "stripe_customer_index", "stripe_customer_id", customer_id
        )

        return self.get_user_table().update_item(
            Key={"pk": item["pk"], "sk": "CREDENTIALS"},
            UpdateExpression="SET auto_renew = :v1",
            ExpressionAttributeValues={":v1": active},
        )

    def get_verification_status(self, key: str) -> bool:
        auth_user = self.get_credentials_from_key(key)
        return auth_user.verified

    def delete_key(self, key: str, sk: str):
        self.get_user_table().delete_item(Key={"pk": key, "sk": sk})

    def get_user(self, email: str) -> User:
        try:
            payload = self.user_database_email_index.get_item(email.lower())
            return User().deserialize(payload)
        except ApiException as e:
            raise AuthExceptions.USER_NOT_FOUND if e.status_code == 404 else e

    def get_credentials_from_key(self, account_key: str) -> User:
        item = self.get_item(account_key)
        return User().deserialize(item)

    def put_token(self, key: str, token_type: str, token: str, expiry_hours: int = 1):
        item = {
            "pk": key,
            "sk": token_type,
            "token": token,
            "last_activity": self.get_timestamp_int(),
            "expiry_time": self.get_timestamp_int() + (expiry_hours * 3600),
        }
        return self.get_user_table().put_item(Item=item)

    def get_key_for_token(self, token: str):
        try:
            payload = self.get_item_from_gsi("token_index", "token", token)
            key = payload["pk"]
            return key
        except ApiException as e:
            raise AuthExceptions.TOKEN_NOT_FOUND if e.status_code == 404 else e

    def get_item(self, account_key: str):
        return self.get_item_with_sk(account_key, "CREDENTIALS")

    def get_stripe_customer_id(self, account_key: str):
        credentials = self.get_item(account_key)
        customer_id = credentials.get("stripe_customer_id", None)

        if customer_id is None:
            raise ApiException(404, "Payment customer ID not found for this customer!")
        return customer_id

    def get_item_with_sk(self, account_key: str, sk: str):
        table = self.get_user_table()
        response = table.get_item(Key={"pk": account_key, "sk": sk})
        if "Item" not in response:
            raise AuthExceptions.USER_NOT_FOUND
        return response["Item"]

    def get_membership_status(self, account_key: str) -> MembershipStatus:
        item = self.get_item(account_key)
        if "membership_expiry_time" in item:
            membership_expiry_time = int(item["membership_expiry_time"])
            if int(time.time()) > membership_expiry_time:
                raise AuthExceptions.MEMBERSHIP_NOT_VALID

            # Get auto-renew status.
            membership_status = MembershipStatus()
            membership_status.expiry_time = membership_expiry_time
            membership_status.auto_renew = item.get("auto_renew", False)
            return membership_status
        else:
            raise AuthExceptions.MEMBERSHIP_NOT_VALID

    def get_item_from_gsi(self, gsi_index: str, gsi_key: str, gsi_value: str):
        print(f"Getting GSI Items for {gsi_key}.")
        table = self.get_user_table()
        response = table.query(
            IndexName=gsi_index,
            KeyConditionExpression="#K = :v1",
            ExpressionAttributeValues={
                ":v1": gsi_value,
            },
            ExpressionAttributeNames={
                "#K": gsi_key,
            },
        )

        if "Items" not in response:
            raise AuthExceptions.KEY_NOT_FOUND

        items = response["Items"]

        if len(items) == 0:
            raise AuthExceptions.KEY_NOT_FOUND

        if len(items) > 1:
            raise AuthExceptions.DUPLICATE_ENTRIES_FOUND.with_message(
                f"Unexpected duplicate entries were found for index {gsi_index} and key {gsi_key}.",
            )

        return items[0]

    def get_user_table(self):
        return self.user_database.table

    def get_timestamp_int(self):
        return int(time.time())

    def is_test_user(self, email: str):
        return email.startswith("test-user")
