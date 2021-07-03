from foo_handler_base import FooHandlerBase
from return_message import new_return_message


class FooGetPostHandler(FooHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"key": True}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        item_key = request_data["key"]

        # Get the item from table.
        item = self.get_item(item_key, "POST")
        processed_items = [
            {
                "content": item["primary_value"],
                "user": item["user_key"],
                "key": item["pk"],
            }
        ]

        response_payload = {"items": processed_items}

        return new_return_message(
            200,
            f"Successfully ran my foo_get_post: {response_payload}",
            response_payload,
        )
