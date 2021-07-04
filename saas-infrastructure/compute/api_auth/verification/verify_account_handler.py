from base.auth_handler import AuthHandler
from api_utils import api_response


class VerifyAccountHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.operation_name = "verify_account"
        self.schema = {"verification_token"}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        token = request_data["verification_token"]
        account_key = self.get_key_for_token(token)

        # Flip the verification status of this user.
        self.update_user_verification(account_key)

        # To prevent inconsistent read, set "verified" to True.
        response_payload = {"key": account_key, "verified": True}

        return api_response(
            200,
            f"Verification Success for account key {account_key}",
            response_payload,
        )
