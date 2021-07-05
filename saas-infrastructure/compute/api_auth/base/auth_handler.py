import time
import os

from api_utils import ApiHandler, ApiException, ApiDatabase
from base.input_validator import InputValidator
from base.membership_status import MembershipStatus
from base.auth_exceptions import AuthExceptions
from model.user import User
from model.verification_token import VerificationToken
from model.account_reset_token import AccountResetToken


class AuthHandler(ApiHandler):

    EXPIRY_MINUTES = 60

    def __init__(self):
        super().__init__()

        # Environment load once.
        self.jwt_hash_key = os.getenv("AUTH_SECRET", "")

        # Validators.
        self.validator: InputValidator = InputValidator()

        # Set up the user database table.
        self.user_database: ApiDatabase = ApiDatabase.from_env("TABLE_NAME")
        self.user_database_email_index = self.user_database.from_index(
            "email_index", "email"
        )
        self.user_database_token_index = self.user_database.from_index(
            "token_index", "token"
        )

    def get_user_by_email(self, email: str) -> User:
        try:
            payload = self.user_database_email_index.get_item(email.lower())
            return User().deserialize(payload)
        except ApiException as e:
            raise AuthExceptions.USER_NOT_FOUND if e.status_code == 404 else e

    def get_user_by_id(self, account_id: str) -> User:
        item = self.user_database.get_item_with_keys(account_id, "CREDENTIALS")
        return User().deserialize(item)

    def get_verification_status(self, account_id: str) -> bool:
        auth_user = self.get_user_by_id(account_id)
        return auth_user.verified

    def get_account_id_for_otp_token(self, otp_token: str):
        item = self.user_database_token_index.get_item(otp_token)
        return item["pk"]

    def update_user_verification(self, key: str):
        return self.user_database.update_item(
            pk=key, sk=User().sk, updated_values={"verified": True}
        )

    def is_test_user(self, email: str):
        return email.startswith("test-user")

    def put_verification_token(self, key: str, token: str, expiry_hours: int = 1):
        verification_token = VerificationToken()
        verification_token.pk = key
        verification_token.token = token
        verification_token.with_x_hour_expiry(expiry_hours)
        self.user_database.put_item(verification_token)

    # OLD ===========================

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

    def get_user_table(self):
        return self.user_database.table

    def get_timestamp_int(self):
        return int(time.time())
