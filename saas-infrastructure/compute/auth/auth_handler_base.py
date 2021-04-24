import json
import os
import boto3
import time
from handler_base import HandlerBase
import jwt
from handler_exception import HandlerException


class AuthUser:
    def __init__(self, key, user, hashed_password_str, verified: bool = False):
        self.key: str = key
        self.user: str = user
        self.hashed_password_str: str = hashed_password_str
        self.verified: bool = verified

    def get_token(self, hash_key: str):
        token = jwt.encode(
            {"account_key": self.key, "user": self.user, "verified": self.verified},
            hash_key,
            algorithm="HS256",
        )
        return token

    @staticmethod
    def from_payload(payload: dict):
        return AuthUser(
            payload["pk"],
            payload["user"],
            payload["hashed_password"],
            payload["verified"],
        )


class AuthHandlerBase(HandlerBase):

    EXPIRY_MINUTES = 60
    JWT_HASH_KEY = "wqd53034578vj10@!_FJf93fh23fF#@jf302f"

    def __init__(self):
        self.schema = {}
        self.action = None
        self.user_table = None
        self.session_table = None

    def put_user_credentials(
        self,
        key: str,
        user: str,
        hashed_password: str,
        should_expire: bool,
        should_verify: bool = False,
    ):

        item = {
            "pk": key,
            "sk": "CREDENTIALS",
            "user": user,
            "hashed_password": hashed_password,
            "verified": should_verify,
            "last_activity": int(time.time()),
        }

        if should_expire:
            item["expiry_time"] = int(time.time() + self.EXPIRY_MINUTES * 60)

        return self.get_user_table().put_item(Item=item)

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

    def delete_key(self, key: str, sk: str):
        self.get_user_table().delete_item(Key={"pk": key, "sk": sk})

    def get_user_credentials(self, user: str) -> (AuthUser, dict):
        # User is not case sensitive.
        payload = self.get_item_from_gsi("user_index", "user", user.lower())
        return AuthUser.from_payload(payload)

    def get_credentials_from_key(self, account_key: str) -> (AuthUser, dict):
        payload = self.get_item(account_key)
        return AuthUser.from_payload(payload)

    def can_create_user(self, user: str) -> bool:
        try:
            self.get_user_credentials(user)
        except HandlerException as e:
            if e.status_code == 404:
                return True
        return False

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
        payload = self.get_item_from_gsi("token_index", "token", token)
        key = payload["pk"]
        return key

    def get_item(self, account_key: str):
        table = self.get_user_table()
        response = table.get_item(Key={"pk": account_key, "sk": "CREDENTIALS"})
        if "Item" not in response:
            raise HandlerException(404, f"Item {account_key} was not found.")

        return response["Item"]

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
            raise HandlerException(404, f"Items {gsi_key} was not found.")

        items = response["Items"]

        if len(items) == 0:
            raise HandlerException(404, "Token not found.")

        if len(items) > 1:
            raise HandlerException(500, f"More than 1 match found. {len(items)}")

        return items[0]

    def get_user_table(self):
        if self.user_table is None:
            self.user_table = self.get_default_table()
        return self.user_table

    def get_timestamp_int(self):
        return int(time.time())

    def is_test_user(self, email: str):
        return email.startswith("test-user")