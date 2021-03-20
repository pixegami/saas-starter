import json
import time
from auth_handler_base import AuthHandlerBase
import uuid
from handler_exception import HandlerException
from return_message import new_return_message


class ConfirmAccountHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"confirm_token": True}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        token = request_data["confirm_token"]
        account_key = self.get_key_for_token(token)

        # Flip the confirmation status of this user.
        self.update_user_confirmation(account_key)

        # Reload the user and get the confirmed status.
        auth_user = self.get_credentials_from_key(account_key)

        # To prevent inconsistent read, set "confirmed" to True.
        response_payload = {"key": account_key, "confirmed": auth_user.confirmed}
        auth_user.confirmed = True
        token = auth_user.get_token(self.JWT_HASH_KEY)

        return new_return_message(
            200,
            f"Confirm Token Success for account key {account_key}",
            response_payload,
        )
