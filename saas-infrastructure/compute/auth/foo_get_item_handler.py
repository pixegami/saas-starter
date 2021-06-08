from foo_handler_base import FooHandlerBase
from return_message import new_return_message


class FooGetItemHandler(FooHandlerBase):
    def __init__(self):
        super().__init__()

    def handle_action(self, request_data: dict, event: dict, context: dict):

        # Write item to the DB.
        item = self.get_latest_item()

        response_payload = {
            "pk": item["pk"],
            "item_content": item["primary_value"],
            "user_key": item["user_key"],
            "compound_key": item["compound_key"],
        }
        return new_return_message(
            200,
            f"Successfully ran my foo_get: {response_payload}",
            response_payload,
        )
