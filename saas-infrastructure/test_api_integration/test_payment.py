from utils import *


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
    validate_membership(token, 200)


# =================================================
# Helper functions
# =================================================


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
