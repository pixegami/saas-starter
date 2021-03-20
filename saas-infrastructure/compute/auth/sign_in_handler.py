import json
import time
from auth_handler_base import AuthHandlerBase
import bcrypt
import jwt
import uuid
import traceback
from handler_exception import HandlerException
from return_message import new_return_message


class SignInHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"user": True, "password": True, "flags": False}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        user = request_data["user"]
        password = request_data["password"]

        # Check if user exists.
        user_creds = self.get_user_credentials(user)

        # Check if passwords match.
        is_valid = bcrypt.checkpw(
            str.encode(password), str.encode(user_creds.hashed_password_str)
        )

        # If they do, create a JWT and send it back.
        if not is_valid:
            raise HandlerException(403, f"Auth failure!")

        token = user_creds.get_token(self.JWT_HASH_KEY)
        response_payload = {"token": token}

        return new_return_message(
            200,
            f"Successfully process sign-in request for {user} id {user_creds.key}"
            f"and token {token}. ",
            response_payload,
        )
