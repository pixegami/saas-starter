from auth_handler_base import AuthHandler
from return_message import new_return_message
from validate_token import validate_token


class ValidateTokenHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.schema = {"future_time": False}

    def handle_action(self, request_data: dict, event: dict, context: dict):
        future_time = int(request_data.get("future_time", 0))
        response_payload = validate_token(event, future_time)
        return new_return_message(
            200,
            f"Successfully validated token: {response_payload}",
            response_payload,
        )
