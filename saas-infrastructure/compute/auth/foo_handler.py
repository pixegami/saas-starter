from auth_handler_base import AuthHandlerBase
from handler_base import HandlerBase
from return_message import new_return_message


class FooHandler(HandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        response_payload = {}
        return new_return_message(
            200,
            f"Successfully ran my foo: {response_payload}",
            response_payload,
        )
