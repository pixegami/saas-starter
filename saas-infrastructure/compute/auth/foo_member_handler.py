from foo_handler_base import FooHandlerBase
from return_message import new_return_message


class FooMemberHandler(FooHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        # If not signed in, fail.
        payload = self.validated_payload(event, validate_member=True)

        response_payload = {"token_payload": payload}
        return new_return_message(
            200,
            f"Successfully ran my member foo: {response_payload}",
            response_payload,
        )
