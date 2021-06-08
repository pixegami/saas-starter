from handler_base import HandlerBase
from auth_exceptions import AuthExceptions
from handler_exception import HandlerException

import urllib3
import json
import uuid
import time
import os
import jwt


class ApiResponse:
    def __init__(self, status: int, data: dict):
        self.status = status
        self.data = data


class FooHandlerBase(HandlerBase):
    def __init__(self):
        super().__init__()
        self.auth_endpoint = os.getenv("AUTH_ENDPOINT")
        self.item_table = None

    def validated_payload(self, event):
        # If not signed in, fail.
        token = self.token_from_header(event)
        self.validate(token)

        # If not member, fail.
        self.validate_membership(token)

        # If success, return the validated payload.
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload

    def put_item(
        self,
        item_type: str,
        user_key: str,
        primary_value: str,
        should_expire: bool,
    ):

        key = uuid.uuid4().hex
        timestamp = int(time.time())
        compound_key = f"{item_type}-{user_key}"

        item = {
            "pk": key,
            "type": item_type,
            "user_key": user_key,
            "compound_key": compound_key,
            "updated_time": timestamp,
            "primary_value": primary_value,
        }

        if should_expire:
            item["expiry_time"] = int(time.time() + 600)

        return self.get_item_table().put_item(Item=item)

    def get_latest_item(self):
        item = self.get_item_from_gsi("type_index", "type", "POST", reverse=True)
        return item

    def get_item_from_gsi(
        self, gsi_index: str, gsi_key: str, gsi_value: str, reverse: bool = False
    ):
        print(f"Getting GSI Items for {gsi_key}.")
        table = self.get_item_table()
        response = table.query(
            IndexName=gsi_index,
            KeyConditionExpression="#K = :v1",
            ExpressionAttributeValues={
                ":v1": gsi_value,
            },
            ExpressionAttributeNames={
                "#K": gsi_key,
            },
            Limit=1,
            ScanIndexForward=not reverse,
        )

        if "Items" not in response:
            raise AuthExceptions.KEY_NOT_FOUND

        items = response["Items"]

        if len(items) == 0:
            raise AuthExceptions.KEY_NOT_FOUND

        if len(items) > 1:
            raise AuthExceptions.DUPLICATE_ENTRIES_FOUND.override_message(
                f"Unexpected duplicate entries were found for index {gsi_index} and key {gsi_key}.",
            )

        return items[0]

    def get_item_table(self):
        if self.item_table is None:
            self.item_table = self.get_default_table()
        return self.item_table

    def token_from_header(self, event: dict):
        try:
            headers = self.extract_json(event, "headers")
            auth_header = headers["Authorization"]
            return auth_header.split(" ")[1]
        except Exception as e:
            raise AuthExceptions.MISSING_HEADER

    def extract_json(self, event, key: str):
        try:
            event_body = event[key]
            json_body = (
                json.loads(event_body) if type(event_body) is str else event_body
            )
        except Exception as e:
            raise HandlerException(400, f"Unable to parse JSON data of {key}: {e}")
        return json_body

    def validate(self, token: str):
        response = self.generic_request("GET", operation="validate_token", token=token)
        if response.status != 200:
            raise HandlerException(response.status, "Unable to validate account.")
        return response

    def validate_membership(self, token: str):
        response = self.generic_request(
            "POST", operation="validate_membership", token=token
        )
        if response.status != 200:
            raise HandlerException(response.status, "Not a member!")
        return response

    def generic_request(
        self,
        method: str,
        operation: str,
        payload: dict = {},
        token: str = None,
        extra_flags: list = [],
    ):
        request_data = {
            "operation": operation,
            **payload,
            "flags": ["TMP"] + extra_flags,
        }

        if token:
            headers = {"Authorization": f"Bearer {token}"}
        else:
            headers = None

        http = urllib3.PoolManager()
        if method == "GET":
            response = http.request(
                method, self.auth_endpoint, fields=request_data, headers=headers
            )
        else:
            encoded_request_data = json.dumps(request_data)
            response = http.request(
                method, self.auth_endpoint, body=encoded_request_data, headers=headers
            )

        status = response.status
        response_data = json.loads(response.data.decode("utf-8"))
        return ApiResponse(status, response_data)
