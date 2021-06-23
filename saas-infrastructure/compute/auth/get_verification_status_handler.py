from auth_handler_base import AuthHandlerBase
from return_message import new_return_message
from validate_token import validate_token


class GetVerificationStatusHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        token_payload = validate_token(event)
        account_key = token_payload["account_key"]
        is_verified = self.get_verification_status(account_key)
        response_payload = {"key": account_key, "verified": is_verified}

        return new_return_message(
            200,
            f"Verification Status for account key {account_key}",
            response_payload,
        )
