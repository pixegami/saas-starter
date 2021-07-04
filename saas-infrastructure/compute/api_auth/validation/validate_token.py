import jwt
import time

from base.auth_exceptions import AuthExceptions
from api_utils import extract_json


def validate_token(event, secret: str, future_time: int = 0):
    try:
        headers = extract_json(event, "headers")
        auth_header = headers["Authorization"]
        token = auth_header.split(" ")[1]
    except Exception as e:
        raise AuthExceptions.MISSING_HEADER

    try:
        decoded_token = jwt.decode(token, secret, algorithms=["HS256"])
        _validate_future_expiry(decoded_token, future_time)

    except jwt.ExpiredSignatureError as e:
        raise AuthExceptions.INVALID_TOKEN

    except Exception as e:
        raise AuthExceptions.INVALID_TOKEN

    return decoded_token


def _validate_future_expiry(decoded_token: dict, future_time: int):
    # Additional check if token has expired: also code to simulate future times.
    if "exp" in decoded_token:
        exp_time = int(decoded_token["exp"])
        future_time = max(0, future_time)
        current_time = time.time() + future_time
        if exp_time < current_time:
            raise AuthExceptions.INVALID_TOKEN
