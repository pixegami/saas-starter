import json
import time
from auth_handler_base import AuthHandlerBase, AuthUser
import bcrypt
import jwt
import uuid
from handler_exception import HandlerException
from return_message import new_return_message


class SignUpHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"user": True, "password": True, "flags": False}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        user = request_data["user"]
        password = request_data["password"]
        flags = request_data["flags"] if "flags" in request_data else []

        # Check if user exists.
        if not self.can_create_user(user):
            raise HandlerException(
                400, f"User {user} cannot be created. User already exists."
            )

        # Blah
        key = uuid.uuid4().hex
        hashed_password = bcrypt.hashpw(str.encode(password), salt=bcrypt.gensalt())
        hashed_password_str = hashed_password.decode("utf-8")
        should_expire = "TMP" in flags
        should_confirm = "CONFIRMED" in flags
        self.put_user_credentials(
            key, user, hashed_password_str, should_expire, should_confirm
        )

        auth_user = AuthUser(key, user, hashed_password_str, should_confirm)
        token = auth_user.get_token(self.JWT_HASH_KEY)
        response_payload = {"token": token}

        return new_return_message(
            200,
            f"Successfully process sign-up request for {user} and {hashed_password_str}"
            f"and token {token}. "
            f"Should the user expire: {should_expire}",
            response_payload,
        )
