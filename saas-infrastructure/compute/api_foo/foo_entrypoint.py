from foo_handler import FooHandler
from api_utils import ApiEntrypoint


def handler(event, context=None):

    entry_point = ApiEntrypoint().with_handler(FooHandler())

    # "foo": FooHandler(),
    # "foo_write_post": FooWritePostHandler(),
    # "foo_get_posts": FooGetPostsHandler(),
    # "foo_get_post": FooGetPostHandler(),

    return entry_point.handle(event, context)
