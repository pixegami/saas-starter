from utils import *
import os
import json


def setup():
    pass


def test_create_payment_session():
    token = create_user_token()
    create_payment_session(token, 200)


def test_unpaid_membership_validation_fails():
    token = create_user_token()
    validate_membership(token, 402)


def test_paid_membership_validation():
    token = create_user_token()
    token_payload = get_token_payload(token)
    account_key = token_payload["account_key"]
    trigger_checkout_event(account_key)
    validate_membership(token, 200)


# =================================================
# Helper functions
# =================================================


def trigger_checkout_event(account_key: str):
    local_path = os.path.dirname(__file__)
    with open(f"{local_path}/sample_events/checkout.session.completed.json", "r") as f:
        checkout_event = json.load(f)

    checkout_event["data"]["object"]["client_reference_id"] = account_key
    response = post_request_to_stripe_webhook(payload=checkout_event)
    print(response)
    return assert_status(response, 200)


def create_user_token():
    # User must be signed-up and signed in to create a payment session.
    user = generate_random_email()
    password = generate_random_password()
    sign_up(user, password, 200)
    sign_in_response = sign_in(user, password, 200)
    token = sign_in_response.data["payload"]["token"]
    return token


def create_payment_session(
    token: str, expected_status: Union[int, Set[int], None] = 200
):
    response = post_request(operation="create_payment_session", token=token)
    print(response)
    return assert_status(response, expected_status)


def validate_membership(token: str, expected_status: Union[int, Set[int], None] = 200):
    response = post_request(operation="validate_membership", token=token)
    print(response)
    return assert_status(response, expected_status)


def post_request_to_stripe_webhook(
    payload: dict = {}, token: str = None, extra_flags: list = []
):
    return generic_request_to_stripe_webhook("POST", payload, token, extra_flags)


def generic_request_to_stripe_webhook(
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
            method, STRIPE_WEBHOOK_ENDPOINT, fields=request_data, headers=headers
        )
    else:
        encoded_request_data = json.dumps(request_data)
        response = http.request(
            method, STRIPE_WEBHOOK_ENDPOINT, body=encoded_request_data, headers=headers
        )

    status = response.status
    response_data = json.loads(response.data.decode("utf-8"))
    print("Response:", status, response_data)
    return ApiResponse(status, response_data)
