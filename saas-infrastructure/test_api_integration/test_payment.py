from utils import *


def setup():
    pass


def test_create_payment_session():
    create_payment_session(200)


def create_payment_session(expected_status: Union[int, Set[int], None] = 200):
    # User must be signed-up and signed in to create a payment session.
    user = generate_random_email()
    password = generate_random_password()
    sign_up(user, password, 200)
    sign_in_response = sign_in(user, password, 200)

    token = sign_in_response.data["payload"]["token"]
    response = post_request(operation="create_payment_session", token=token)
    print(response)

    return assert_status(response, expected_status)
