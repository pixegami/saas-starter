from foo_handler_base import FooHandlerBase
from return_message import new_return_message


class FooWritePostHandler(FooHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"content": True}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        # Validate first.
        payload = self.validated_payload(event)

        # Organize data to write.
        content_value = request_data["content"]
        flags = request_data["flags"] if "flags" in request_data else []
        should_expire = "TMP" in flags
        user_key = payload["account_key"]

        # Write item to the DB.
        item_key = self.put_item("POST", user_key, content_value, should_expire)

        response_payload = {"item_key": item_key}

        return new_return_message(
            200,
            f"Successfully ran my foo_write_post: {response_payload}",
            response_payload,
        )
