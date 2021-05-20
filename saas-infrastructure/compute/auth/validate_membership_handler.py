from auth_handler_base import AuthHandlerBase
from return_message import new_return_message
from validate_token import validate_token


class ValidateMembershipHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        token_payload = validate_token(event)
        account_key = token_payload["account_key"]
        self.validate_membership_status(account_key)

        response_payload = token_payload

        return new_return_message(
            200,
            f"Successfully verified membership: {response_payload}",
            response_payload,
        )
