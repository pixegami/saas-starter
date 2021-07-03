from auth_handler_base import AuthHandler
from return_message import new_return_message


class VerifyAccountHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.schema = {"verification_token": True}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        token = request_data["verification_token"]
        account_key = self.get_key_for_token(token)

        # Flip the verification status of this user.
        self.update_user_verification(account_key)

        # To prevent inconsistent read, set "verified" to True.
        response_payload = {"key": account_key, "verified": True}

        return new_return_message(
            200,
            f"Verification Success for account key {account_key}",
            response_payload,
        )
