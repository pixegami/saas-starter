from auth_handler_base import AuthHandlerBase
import bcrypt
from return_message import new_return_message
from token_keys import TokenKeys


class ResetAccountHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"reset_token": True, "new_password": True}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        token = request_data["reset_token"]
        new_password = request_data["new_password"]

        # Validator
        self.validator.password(new_password)

        # Update the hashed password.
        account_key = self.get_key_for_token(token)
        hashed_password = bcrypt.hashpw(str.encode(new_password), salt=bcrypt.gensalt())
        hashed_password_str = hashed_password.decode("utf-8")
        self.update_user_password(account_key, hashed_password_str)
        self.delete_key(account_key, TokenKeys.TOKEN_RESET)

        response_payload = {"reset_token": token, "key": account_key}

        return new_return_message(
            200,
            f"Password reset success for [{account_key}]",
            response_payload,
        )
