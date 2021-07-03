from auth_handler_base import AuthHandler
import bcrypt
from auth_exceptions import AuthExceptions
from return_message import new_return_message
import time


class SignInHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.schema = {"user": True, "password": True, "flags": False}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        user = request_data["user"]
        password = request_data["password"]
        flags = request_data["flags"] if "flags" in request_data else []

        # Check if user exists.
        user_creds = self.get_user_credentials(user)

        # Check if the future flag is enabled and usable by a tmp user (not usable by permanent users).
        is_future = "FUTURE" in flags and user_creds.is_temp

        # Check if sign-in attempts aren't on cooldown.
        attempt_count, next_attempt_time = self.get_sign_in_attempt_failures(
            user_creds.key
        )
        current_time = self.get_future_time() if is_future else time.time()
        if current_time < next_attempt_time:
            raise AuthExceptions.TOO_MANY_FAILED_ATTEMPTS.append_message(
                f" Future status: {is_future}, {flags}, {user_creds.is_temp}"
            )
        else:
            # Reset the attempt count.
            if attempt_count >= self.MAX_SIGN_IN_ATTEMPTS:
                attempt_count = 0

        # Check if passwords match.
        is_valid = bcrypt.checkpw(
            str.encode(password), str.encode(user_creds.hashed_password_str)
        )

        # If they don't, throw an Auth Failure, and update the sign-in attempts.
        if not is_valid:
            # Artificially max out the attempt count if flagged.
            if "MAX_ATTEMPT" in flags:
                attempt_count = self.MAX_SIGN_IN_ATTEMPTS
            self.validate_sign_in_attempts(user_creds, attempt_count)
        else:
            # A valid sign-in attempt should reset the attempt count.
            self.reset_sign_in_attempts(user_creds)

        # If they do, create a JWT and send it back.
        token = user_creds.get_token(self.JWT_HASH_KEY)
        response_payload = {"token": token, "attempt": attempt_count}

        return new_return_message(
            200,
            f"Successfully process sign-in request for {user} id {user_creds.key}"
            f"and token {token}. ",
            response_payload,
        )

    def reset_sign_in_attempts(self, user_creds):
        self.put_sign_in_attempt_failure(user_creds.key, user_creds.user, 0)

    def validate_sign_in_attempts(self, user_creds, attempt_count: int):
        current_attempt = attempt_count + 1
        remaining_attempts = self.MAX_SIGN_IN_ATTEMPTS - current_attempt

        self.put_sign_in_attempt_failure(
            user_creds.key, user_creds.user, current_attempt
        )

        if remaining_attempts <= 3:

            if remaining_attempts == 1:
                message_override = "You have 1 attempt remaining."
            elif remaining_attempts <= 0:
                message_override = (
                    "Too many failed sign-in attempts. Please wait before trying again."
                )
            else:
                message_override = f"You have {remaining_attempts} attempts remaining."

            raise AuthExceptions.AUTH_FAILURE.append_message(message_override)
        else:
            raise AuthExceptions.AUTH_FAILURE

    def get_future_time(self):
        # Timestamp 7 days in the future.
        return time.time() + 7 * self.EXPIRY_24_HOURS
