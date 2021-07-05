from utils.api_utils import *
import time


def setup():
    pass


def test_sign_up():

    email = generate_random_email()
    password = generate_random_password()
    sign_up(email, password, 200)

    # Sign-in should succeed.
    sign_in_response = sign_in(email, password, 200)

    # Validation should succeed.
    validate(sign_in_response.get_token())


def test_verify_account():
    user = generate_random_email()
    password = generate_random_password()
    sign_up_response = sign_up(user, password)
    token = sign_up_response.get_token()

    # User hasn't verified, so this should return false.
    verification_status_response = get_verification_status(token)
    is_verified(token, False)

    # Now verify the account and check again.
    verify_user(token)
    is_verified(token)


def test_can_create_test_user():
    # Can use the 'test user' endpoint to create one with pre-confirmed status.
    user = generate_random_email()
    password = generate_random_password()
    response = sign_up_test_user(user, password)
    is_verified(response.get_token())


def test_can_reset_account():
    user = generate_random_email()
    password = generate_random_password()
    new_password = generate_random_password()

    sign_up_test_user(user, password)
    response = request_account_reset(user, 200)

    reset_token = response.data["payload"]["reset_token"]
    reset_account(reset_token, new_password, 200)

    # Wait a second or two before signing in again.
    time.sleep(2)
    sign_in(user, new_password)


############################################
# These tests need email automatic validator
############################################


def test_can_verify_via_email():

    user = generate_random_email(VALIDATION_EMAIL)
    password = generate_random_password()
    sign_up(user, password, 200)

    # Verification email should be sent on sign-up.
    # Wait for the email receiver to resolve.
    time.sleep(5)
    sign_in_response = sign_in(user, password, 200)
    token_payload = token_payload_from_response(sign_in_response)
    print("Token Payload: ", token_payload)
    assert token_payload["verified"]


def test_can_reset_account_via_email():

    user = generate_random_email(VALIDATION_EMAIL)
    password = generate_random_password()

    sign_up_test_user(user, password, 200)
    request_account_reset(user, 200)

    # Give SES time to process the email.
    time.sleep(5)
    sign_in(user, AUTO_RESET_PASSWORD)


def verify_user(token: str):
    token_payload = jwt.decode(token, options={"verify_signature": False})
    account_id = token_payload["account_id"]
    response = request_account_verification(account_id, 200)

    verification_url = response.from_payload("verification_url")
    http = urllib3.PoolManager()
    response = http.request("GET", verification_url)
    print(response.status, response.data)
    assert response.status == 200


def is_verified(token: str, should_be_verified: bool = True):
    verification_status_response = get_verification_status(token)
    assert verification_status_response.from_payload("verified") is should_be_verified
