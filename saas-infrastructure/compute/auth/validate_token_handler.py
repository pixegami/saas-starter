from auth_handler_base import AuthHandlerBase
import jwt
import traceback
from return_message import new_return_message
from auth_exceptions import AuthExceptions


class ValidateTokenHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        try:
            print(f"Got Event: {event}")
            headers = self.extract_json(event, "headers")
            auth_header = headers["Authorization"]
            print(f"Got auth header: {auth_header}")
            token = auth_header.split(" ")[1]
            print(f"Got token: {token}")
        except Exception as e:
            raise AuthExceptions.MISSING_HEADER

        try:
            decoded_token = jwt.decode(token, self.JWT_HASH_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError as e:
            print(f"Caught Exception: {str(e)}")
            traceback.print_exc()
            raise AuthExceptions.INVALID_TOKEN
        except Exception as e:
            raise AuthExceptions.INVALID_TOKEN

        response_payload = decoded_token
        return new_return_message(
            200,
            f"Successfully validated token: {decoded_token}",
            response_payload,
        )
