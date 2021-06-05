import os
from auth_exceptions import AuthExceptions
from auth_handler_base import AuthHandlerBase
from handler_exception import HandlerException
from handler_base import HandlerBase
from return_message import new_return_message
import urllib3
import json


class ApiResponse:
    def __init__(self, status: int, data: dict):
        self.status = status
        self.data = data


class FooMemberHandler(HandlerBase):
    def __init__(self):
        self.auth_endpoint = os.getenv("AUTH_ENDPOINT")
        super().__init__()
        self.schema = {}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        # If not signed in, fail.
        token = self.token_from_header(event)
        self.validate(token)

        # If not member, fail.
        self.validate_membership(token)

        response_payload = {}
        return new_return_message(
            200,
            f"Successfully ran my member foo: {response_payload}",
            response_payload,
        )

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
