from auth_handler_base import AuthHandlerBase, AuthUser
import bcrypt
import uuid
from handler_exception import HandlerException
from return_message import new_return_message
from request_account_verification_token import request_account_verification_token


class SignUpHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"user": True, "password": True, "flags": False}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        # Username/email should not be case sensitive.
        email = user = str(request_data["user"]).lower()
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
        should_verify = "AUTO_VERIFY" in flags

        self.put_user_credentials(
            key, user, hashed_password_str, should_expire, should_verify
        )

        auth_user = AuthUser(key, user, hashed_password_str, should_verify)
        token = auth_user.get_token(self.JWT_HASH_KEY)
        response_payload = {"token": token}

        # Create verification token (if it's not auto-verified).
        if not should_verify:
            request_account_verification_token(self, email, key)

        return new_return_message(
            200,
            f"Successfully process sign-up request for {user} and {hashed_password_str}"
            f"and token {token}. "
            f"Should the user expire: {should_expire}",
            response_payload,
        )
