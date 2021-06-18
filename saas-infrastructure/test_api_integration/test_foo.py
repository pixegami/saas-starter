from utils import *
import os
import json


FOO_ENDPOINT = f"https://api.{DOMAIN}/foo"


def setup():
    pass


def test_foo():
    foo_request = {"operation": "foo"}
    response = assert_status(post_request_to_foo(foo_request), 200)
    assert response.payload["is_signed_in"] is False
    assert response.payload["is_member"] is False
    assert response.payload["is_verified"] is False


def test_foo_signed_in():
    token = create_user_token()
    foo_request = {"operation": "foo"}
    response = assert_status(post_request_to_foo(foo_request, token), 200)
    assert response.payload["is_signed_in"] is True
    assert response.payload["is_member"] is False
    assert response.payload["is_verified"] is True


def test_foo_member():
    token = create_user_token(is_member=True)
    foo_request = {"operation": "foo"}
    response = assert_status(post_request_to_foo(foo_request, token), 200)
    assert response.payload["is_signed_in"] is True
    assert response.payload["is_member"] is True
    assert response.payload["is_verified"] is True


def test_foo_member_only():
    token = create_user_token(is_member=True)
    foo_request = {"operation": "foo_member"}
    assert_status(post_request_to_foo(foo_request, token), 200)


def test_foo_member_not_authorized():
    foo_request = {"operation": "foo_member"}
    assert_status(post_request_to_foo(foo_request), 403)


def test_foo_member_not_subscribed():
    token = create_user_token()
    foo_request = {"operation": "foo_member"}
    assert_status(post_request_to_foo(foo_request, token), 402)


def test_foo_write_and_get_posts():
    token = create_user_token()
    random_content = f"Hello Random Content {uuid.uuid4().hex[:6]}"
    foo_request = {"operation": "foo_write_post", "content": random_content}
    write_response = assert_status(post_request_to_foo(foo_request, token), 200)
    assert write_response.payload["item_key"] is not None
    item_key = write_response.payload["item_key"]

    # Now try to get the same item.
    foo_request = {"operation": "foo_get_posts"}
    item_response = assert_status(post_request_to_foo(foo_request, token), 200)
    print(item_response.payload)

    # Check it is returned in the batch.
    posts = item_response.payload["items"]
    latest_post = posts[0]
    assert latest_post["content"] == random_content

    # Check that we can get the item directly.
    foo_request = {"operation": "foo_get_post", "key": item_key}
    item_response = assert_status(post_request_to_foo(foo_request, token), 200)
    posts = item_response.payload["items"]
    latest_post = posts[0]
    assert latest_post["content"] == random_content


def test_foo_non_member_cannot_post():
    random_content = f"Hello Random Content {uuid.uuid4().hex[:6]}"
    foo_request = {"operation": "foo_write_post", "content": random_content}
    assert_status(post_request_to_foo(foo_request), 403)


# =================================================
# Helper functions
# =================================================


def create_user_token(is_member: bool = False):
    # User must be signed-up and signed in to create a payment session.
    user = generate_random_email()
    password = generate_random_password()

    if is_member:
        sign_up_test_user_as_member(user, password, 200)
    else:
        sign_up_test_user(user, password, 200)

    sign_in_response = sign_in(user, password, 200)
    token = sign_in_response.data["payload"]["token"]
    return token


def post_request_to_foo(payload: dict = {}, token: str = None, extra_flags: list = []):
    return generic_request_to_foo("POST", payload, token, extra_flags)


def generic_request_to_foo(
    method: str,
    payload: dict = {},
    token: str = None,
    extra_flags: list = [],
):
    request_data = {**payload, "flags": ["TMP"] + extra_flags}

    if token:
        headers = {"Authorization": f"Bearer {token}"}
    else:
        headers = None

    http = urllib3.PoolManager()
    if method == "GET":
        response = http.request(
            method, FOO_ENDPOINT, fields=request_data, headers=headers
        )
    else:
        encoded_request_data = json.dumps(request_data)
        response = http.request(
            method, FOO_ENDPOINT, body=encoded_request_data, headers=headers
        )

    status = response.status
    response_data = json.loads(response.data.decode("utf-8"))
    print("Response:", status, response_data)
    return ApiResponse(status, response_data)
