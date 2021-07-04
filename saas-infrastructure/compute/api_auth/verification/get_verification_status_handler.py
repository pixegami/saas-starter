from base.auth_handler import AuthHandler
from api_utils import api_response
from validation.validate_token import validate_token


class GetVerificationStatusHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.operation_name = "get_verification_status"

    def handle_action(self, request_data: dict, event: dict, context: dict):

        token_payload = validate_token(event, self.jwt_hash_key)
        account_id = token_payload["account_id"]
        is_verified = self.get_verification_status(account_id)
        response_payload = {"account_id": account_id, "verified": is_verified}

        return api_response(
            200,
            f"Verification Status for account id {account_id}",
            response_payload,
        )
