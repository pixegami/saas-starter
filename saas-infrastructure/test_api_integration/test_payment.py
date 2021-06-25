from typing import Tuple
from utils import *
import os
import json


def setup():
    pass


def test_create_payment_session():
    token = create_user_token()
    create_payment_session(token, 200)


def test_create_portal_session():
    token = create_user_token()
    create_payment_portal_session(token, 200)


def test_unpaid_membership_validation_fails():
    token = create_user_token(generate_random_customer_id())
    validate_membership(token, 402)


def test_paid_membership_validation():
    setup_paid_membership()


def test_paid_membership_cancellation():
    token, customer_id = setup_paid_membership()
    trigger_subscription_cancel_at_end_event(customer_id)
    response = validate_membership(token, 200)
    assert response.payload["auto_renew"] is False


def test_paid_membership_deletion():
    token, customer_id = setup_paid_membership()
    trigger_subscription_deleted_event(customer_id)
    response = validate_membership(token, 200)
    assert response.payload["auto_renew"] is False


# =================================================
# Helper functions
# =================================================


def setup_paid_membership() -> Tuple[str, str]:

    customer_id = generate_random_customer_id()
    token = create_user_token(customer_id)

    token_payload = get_token_payload(token)
    account_key = token_payload["account_key"]
    trigger_checkout_event(account_key)
    response = validate_membership(token, 200)

    assert response.payload["expiry_time"] > time.time()
    assert response.payload["auto_renew"] is True

    return token, customer_id


def trigger_checkout_event(account_key: str):
    webhook_event = get_event("checkout.session.completed.json")
    webhook_event["data"]["object"]["client_reference_id"] = account_key
    trigger_event(webhook_event)


def trigger_subscription_deleted_event(customer_id: str):
    webhook_event = get_event("customer.subscription.deleted.json")
    webhook_event["data"]["object"]["cancel_at_period_end"] = True
    webhook_event["data"]["object"]["customer"] = customer_id
    trigger_event(webhook_event)
    pass


def trigger_subscription_cancel_at_end_event(customer_id: str):
    webhook_event = get_event("customer.subscription.updated.json")
    webhook_event["data"]["object"]["cancel_at_period_end"] = True
    webhook_event["data"]["object"]["customer"] = customer_id
    trigger_event(webhook_event)


def get_event(file_name: str):
    local_path = os.path.dirname(__file__)
    with open(f"{local_path}/sample_events/{file_name}", "r") as f:
        webhook_event = json.load(f)
    return webhook_event


def trigger_event(webhook_event: dict):
    response = post_request_to_stripe_webhook(payload=webhook_event)
    return assert_status(response, 200)


def create_user_token(override_customer_id: str = None):
    # User must be signed-up and signed in to create a payment session.
    user = generate_random_email()
    password = generate_random_password()

    flags = []
    if override_customer_id:
        flags.append(f"OVERRIDE_CUSTOMER_ID:{override_customer_id}")

    sign_up(user, password, 200, flags)
    sign_in_response = sign_in(user, password, 200)
    token = sign_in_response.data["payload"]["token"]
    return token


def create_payment_session(
    token: str, expected_status: Union[int, Set[int], None] = 200
):
    response = post_request(
        operation="create_payment_session",
        payload={"return_endpoint": "http://127.0.0.1:8000/app"},
        token=token,
    )
    print(response)
    return assert_status(response, expected_status)


def create_payment_portal_session(
    token: str, expected_status: Union[int, Set[int], None] = 200
):
    response = post_request(
        operation="create_payment_portal_session",
        payload={"return_endpoint": "http://127.0.0.1:8000/app"},
        token=token,
    )
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
