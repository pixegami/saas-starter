from base.auth_handler import AuthHandler
from api_utils import api_response
from validation.validate_token import validate_token


class ValidateTokenHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.operation_name = "validate_token"

    def handle_action(self, request_data: dict, event: dict, _context: dict):
        future_time = int(request_data.get("future_time", 0))
        response_payload = validate_token(event, self.jwt_hash_key, future_time)
        return api_response(
            200,
            f"Successfully validated token: {response_payload}",
            response_payload,
        )
