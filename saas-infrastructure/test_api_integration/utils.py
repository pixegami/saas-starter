import json
import uuid
import urllib3
import jwt
import time


API_ENDPOINT = "https://api.ss.pixegami.com/auth"
VALIDATION_EMAIL = "auth.pixegami.com"  # Emails sent here get auto-validated.
AUTO_RESET_PASSWORD = (
    "myAutoResetPassword"  # The email validator will reset the password to this.
)
JWT_KEY = "SOME_KEY"

############################################
# API/Supporting functions
############################################


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


def request_account_verification(account_key: str, expected_status: int = 200):
    payload = {"account_key": account_key}
    status, response_data = post_request(
        operation="request_account_verification", payload=payload
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
