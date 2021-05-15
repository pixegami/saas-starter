from auth_handler_base import AuthHandlerBase
from return_message import new_return_message
from validate_token import validate_token


class ValidateTokenHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {}

    def handle_action(self, request_data: dict, event: dict, context: dict):
        response_payload = validate_token(event)
        return new_return_message(
            200,
            f"Successfully validated token: {response_payload}",
            response_payload,
        )
