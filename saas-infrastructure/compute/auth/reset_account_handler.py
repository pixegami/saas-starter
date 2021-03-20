import json
import time
from auth_handler_base import AuthHandlerBase
import uuid
import bcrypt
from return_message import new_return_message


class ResetAccountHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"reset_token": True, "new_password": True}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        token = request_data["reset_token"]
        new_password = request_data["new_password"]

        account_key = self.get_key_for_token(token)

        # Update the hashed password.
        hashed_password = bcrypt.hashpw(str.encode(new_password), salt=bcrypt.gensalt())
        hashed_password_str = hashed_password.decode("utf-8")
        self.update_user_password(account_key, hashed_password_str)
        self.delete_key(account_key, self.TOKEN_RESET)

        response_payload = {"reset_token": token, "key": account_key}

        return new_return_message(
            200,
            f"Confirm Token Success for account key {account_key}",
            response_payload,
        )
