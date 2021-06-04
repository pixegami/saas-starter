import json
import uuid
import urllib3
import jwt
import time
from typing import Union, Set

# Load the config JSON from root directory.
with open("./service.config.json", "r") as f:
    config_data = json.load(f)


DOMAIN = config_data["domain"]
API_ENDPOINT = f"https://api.{DOMAIN}/auth"
STRIPE_WEBHOOK_ENDPOINT = f"https://api.{DOMAIN}/stripe"

VALIDATION_EMAIL = f"auth.{DOMAIN}"  # Emails sent here get auto-validated.
AUTO_RESET_PASSWORD = (
    "myAutoResetPasswordAB12!"  # The email validator will reset the password to this.
)
JWT_KEY = "SOME_KEY"

############################################
# API/Supporting functions
############################################


class ApiResponse:
    def __init__(self, status: int, data: dict):
        self.status = status
        self.data = data


def sign_up(
    user: str, password: str, expected_status: Union[int, Set[int], None] = 200
):
    response = post_request(
        operation="sign_up", payload={"user": user, "password": password}
    )
    return assert_status(response, expected_status)


def sign_up_test_user(
    user: str, password: str, expected_status: Union[int, Set[int], None] = 200
):
    response = post_request(
        operation="create_test_account", payload={"user": user, "password": password}
    )
    return assert_status(response, expected_status)


def sign_in(
    user: str,
    password: str,
    expected_status: Union[int, Set[int], None] = 200,
    flags: list = [],
):
    response = post_request(
        operation="sign_in",
        payload={"user": user, "password": password},
        extra_flags=flags,
    )
    return assert_status(response, expected_status)


def sign_in_future(
    user: str, password: str, expected_status: Union[int, Set[int], None] = 200
):
    # Sign in, but X days into the future (to test lock-out cooldown).
    return sign_in(user, password, expected_status, ["FUTURE"])


def sign_in_max_attempt(
    user: str, password: str, expected_status: Union[int, Set[int], None] = 200
):
    # Sign in, but X days into the future (to test lock-out cooldown).
    return sign_in(user, password, expected_status, ["MAX_ATTEMPT"])


def assert_status(
    response: ApiResponse, expected_status: Union[int, Set[int], None] = 200
):
    if expected_status is None:
        return response

    if type(expected_status) is int:
        assert response.status == expected_status
    else:
        assert response.status in expected_status

    return response


def validate(token: str, expected_status: Union[int, Set[int], None] = 200):
    response = get_request(operation="validate_token", token=token)
    return assert_status(response, expected_status)


def request_account_verification(
    account_key: str, expected_status: Union[int, Set[int], None] = 200
):
    payload = {"account_key": account_key}
    response = post_request(operation="request_account_verification", payload=payload)
    return assert_status(response, expected_status)


def request_account_reset(user: str, expected_status: Union[int, Set[int], None] = 200):
    payload = {"user": user}
    response = post_request(operation="request_account_reset", payload=payload)
    return assert_status(response, expected_status)


def reset_account(
    reset_token: str,
    new_password: str,
    expected_status: Union[int, Set[int], None] = 200,
):
    payload = {"reset_token": reset_token, "new_password": new_password}
    response = post_request(operation="reset_account", payload=payload)
    return assert_status(response, expected_status)


def get_request(
    operation: str, payload: dict = {}, token: str = None, extra_flags: list = []
):
    return generic_request("GET", operation, payload, token, extra_flags)


def post_request(
    operation: str, payload: dict = {}, token: str = None, extra_flags: list = []
):
    return generic_request("POST", operation, payload, token, extra_flags)


def generic_request(
    method: str,
    operation: str,
    payload: dict = {},
    token: str = None,
    extra_flags: list = [],
):
    request_data = {"operation": operation, **payload, "flags": ["TMP"] + extra_flags}

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
    return ApiResponse(status, response_data)


def token_payload_from_response(response: ApiResponse):
    token = response.data["payload"]["token"]
    return jwt.decode(token, options={"verify_signature": False})


def generate_random_email(base_domain: str = "no-op-test-email.com"):
    return f"test-user-{uuid.uuid4().hex[:12]}@{base_domain}"


def generate_random_password():
    return f"test-pass-1A-{uuid.uuid4().hex[:12]}"


def get_token_payload(token: str):
    return jwt.decode(token, options={"verify_signature": False})
