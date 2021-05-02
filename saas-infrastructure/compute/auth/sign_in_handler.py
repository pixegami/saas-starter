from auth_handler_base import AuthHandlerBase
import bcrypt
from auth_exceptions import AuthExceptions
from return_message import new_return_message
import time


class SignInHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"user": True, "password": True, "flags": False}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        user = request_data["user"]
        password = request_data["password"]

        # Check if user exists.
        user_creds = self.get_user_credentials(user)

        # Check if sign-in attempts aren't on cooldown.
        attempt_count, next_attempt_time = self.get_sign_in_attempt_failures(
            user_creds.key
        )
        if time.time() < next_attempt_time:
            raise AuthExceptions.TOO_MANY_FAILED_ATTEMPTS

        # Check if passwords match.
        is_valid = bcrypt.checkpw(
            str.encode(password), str.encode(user_creds.hashed_password_str)
        )

        # If they don't, throw an Auth Failure, and update the sign-in attempts.
        if not is_valid:
            self.validate_sign_in_attempts(user_creds, attempt_count)

        # If they do, create a JWT and send it back.
        token = user_creds.get_token(self.JWT_HASH_KEY)
        response_payload = {"token": token}

        return new_return_message(
            200,
            f"Successfully process sign-in request for {user} id {user_creds.key}"
            f"and token {token}. ",
            response_payload,
        )

    def validate_sign_in_attempts(self, user_creds, attempt_count: int):
        current_attempt = attempt_count + 1
        remaining_attempts = self.MAX_SIGN_IN_ATTEMPTS - current_attempt

        self.put_sign_in_attempt_failure(
            user_creds.key, user_creds.user, current_attempt
        )

        if remaining_attempts <= 3:

            if remaining_attempts == 1:
                message_override = "You have 1 attempt remaining."
            elif remaining_attempts == 0:
                message_override = (
                    "Too many failed sign-in attempts. Please wait before trying again."
                )
            else:
                message_override = f"You have {remaining_attempts} attempts remaining."

            raise AuthExceptions.AUTH_FAILURE.append_message(message_override)
        else:
            raise AuthExceptions.AUTH_FAILURE
