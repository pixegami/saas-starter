from foo_handler_base import FooHandlerBase
from return_message import new_return_message


class FooGetPostsHandler(FooHandlerBase):
    def __init__(self):
        super().__init__()

    def handle_action(self, request_data: dict, event: dict, context: dict):

        # Write item to the DB.
        items = self.get_latest_items(count=5)

        processed_items = []
        for item in items:
            processed_items.append(
                {
                    "content": item["primary_value"],
                    "user": item["user_key"],
                    "key": item["primary_value"],
                }
            )

        response_payload = {"items": processed_items}

        return new_return_message(
            200,
            f"Successfully ran my foo_get_posts: {response_payload}",
            response_payload,
        )
