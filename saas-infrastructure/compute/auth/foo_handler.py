from auth_handler_base import AuthHandlerBase
from foo_handler_base import FooHandlerBase
from handler_base import HandlerBase
from return_message import new_return_message


class FooHandler(FooHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        # Check signed in and membership status.
        is_signed_in = self.is_signed_in(event)

        # If not member, fail.
        if is_signed_in:
            token = self.token_from_header(event)
            is_verified = self.is_verified(token)
            is_member = self.is_member(token)
        else:
            is_member = False
            is_verified = False

        response_payload = {
            "is_signed_in": is_signed_in,
            "is_member": is_member,
            "is_verified": is_verified,
        }

        return new_return_message(
            200,
            f"Successfully ran my foo: {response_payload}",
            response_payload,
        )
