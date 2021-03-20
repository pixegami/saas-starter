import urllib3
import json
import uuid
import jwt
import time


API_ENDPOINT = "https://api.ss.pixegami.com/auth"
JWT_KEY = "SOME_KEY"


def setup():
    pass


def test_sign_up():

    user = generate_random_email()
    password = generate_random_password()
    sign_up(user, password, 200)

    # Sign-in should succeed.
    sign_in_response = sign_in(user, password, 200)

    # Validation should succeed.
    token = sign_in_response["payload"]["token"]
    validate(token)


def test_can_confirm_account():
    # A user can sign-up, and confirm their account.

    user = generate_random_email()
    password = generate_random_password()
    sign_up_response = sign_up(user, password, 200)

    token = sign_up_response["payload"]["token"]
    token_payload = jwt.decode(token, options={"verify_signature": False})
    account_key = token_payload["account_key"]
    confirmation_request_response = request_account_confirmation(account_key, 200)
    confirm_url = confirmation_request_response["payload"]["confirm_url"]

    http = urllib3.PoolManager()
    response = http.request("GET", confirm_url)
    print(response.status, response.data)
    assert response.status == 200


def test_can_confirm_via_email():

    user = generate_random_email("auth.pixegami.com")
    password = generate_random_password()
    sign_up_response = sign_up(user, password, 200)

    # This will cause a confirmation email to be sent.
    token = sign_up_response["payload"]["token"]
    token_payload = jwt.decode(token, options={"verify_signature": False})
    account_key = token_payload["account_key"]
    request_account_confirmation(account_key, 200)

    # Wait for the email receiver to resolve.
    time.sleep(5)
    sign_in_response = sign_in(user, password, 200)
    token_payload = token_payload_from_response(sign_in_response)
    assert token_payload["confirmed"]


def test_can_create_test_user():
    # Can use the 'test user' endpoint to create one with pre-confirmed status.
    user = generate_random_email()
    password = generate_random_password()
    response = sign_up_test_user(user, password, 200)

    token_payload = token_payload_from_response(response)
    print(token_payload)
    assert token_payload["confirmed"]


def test_can_reset_account():
    user = generate_random_email()
    password = generate_random_password()
    new_password = generate_random_password()

    sign_up_test_user(user, password, 200)
    response = request_account_reset(user, 200)

    reset_token = response["payload"]["reset_token"]
    reset_account(reset_token, new_password, 200)

    sign_in(user, new_password)


def sign_up(user: str, password: str, expected_status: int = 200):
    status, response_data = post_request(
        operation="sign_up", payload={"user": user, "password": password}
    )
    assert status == expected_status
    return response_data


def sign_up_test_user(user: str, password: str, expected_status: int = 200):
    status, response_data = post_request(
        operation="create_test_account", payload={"user": user, "password": password}
    )
    assert status == expected_status
    return response_data


def sign_in(user: str, password: str, expected_status: int = 200):
    status, response_data = post_request(
        operation="sign_in", payload={"user": user, "password": password}
    )
    assert status == expected_status
    return response_data


def validate(token: str, expected_status: int = 200):
    status, response_data = get_request(operation="validate_token", token=token)
    assert status == expected_status
    return response_data


def request_account_confirmation(account_key: str, expected_status: int = 200):
    payload = {"account_key": account_key}
    status, response_data = post_request(
        operation="request_account_confirmation", payload=payload
    )
    assert status == expected_status
    return response_data


def request_account_reset(user: str, expected_status: int = 200):
    payload = {"user": user}
    status, response_data = post_request(
        operation="request_account_reset", payload=payload
    )
    assert status == expected_status
    return response_data


def reset_account(reset_token: str, new_password: str, expected_status: int = 200):
    payload = {"reset_token": reset_token, "new_password": new_password}
    status, response_data = post_request(operation="reset_account", payload=payload)
    assert status == expected_status
    return response_data


def get_request(operation: str, payload: dict = {}, token: str = None):
    return generic_request("GET", operation, payload, token)


def post_request(operation: str, payload: dict = {}, token: str = None):
    return generic_request("POST", operation, payload, token)


def generic_request(method: str, operation: str, payload: dict = {}, token: str = None):
    request_data = {"operation": operation, **payload, "flags": ["TMP"]}

    if token:
        headers = {"Authorization": f"Bearer {token}"}
    else:
        headers = None

    http = urllib3.PoolManager()
    if method == "GET":
        response = http.request(
            method, API_ENDPOINT, fields=request_data, headers=headers
        )
    else:
        encoded_request_data = json.dumps(request_data)
        response = http.request(
            method, API_ENDPOINT, body=encoded_request_data, headers=headers
        )

    status = response.status
    response_data = json.loads(response.data.decode("utf-8"))
    print("Response:", status, response_data)
    return status, response_data


def token_payload_from_response(response_data):
    token = response_data["payload"]["token"]
    return jwt.decode(token, options={"verify_signature": False})


def generate_random_email(base_domain: str = "pixegami.com"):
    return f"test-user-{uuid.uuid4().hex[:12]}@{base_domain}"


def generate_random_password():
    return f"test-pass-{uuid.uuid4().hex[:12]}"