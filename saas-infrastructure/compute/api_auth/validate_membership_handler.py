from auth_handler_base import AuthHandler
from return_message import new_return_message
from validate_token import validate_token


class ValidateMembershipHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.schema = {}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        token_payload = validate_token(event)
        account_key = token_payload["account_key"]
        membership_status = self.get_membership_status(account_key)

        response_payload = {
            "token_payload": token_payload,
            "expiry_time": membership_status.expiry_time,
            "auto_renew": membership_status.auto_renew,
        }

        return new_return_message(
            200,
            f"Successfully verified membership: {response_payload}",
            response_payload,
        )
