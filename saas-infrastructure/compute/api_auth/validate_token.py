import traceback
import os
import json
import jwt
import time

from auth_exceptions import AuthExceptions
from handler_exception import HandlerException


JWT_HASH_KEY = os.getenv("AUTH_SECRET")


def validate_token(event, future_time: int = 0):
    try:
        print(f"Got Event: {event}")
        headers = extract_json(event, "headers")
        auth_header = headers["Authorization"]
        token = auth_header.split(" ")[1]
    except Exception as e:
        raise AuthExceptions.MISSING_HEADER

    try:
        decoded_token = jwt.decode(token, JWT_HASH_KEY, algorithms=["HS256"])

        # Additional check if token has expired: also code to simulate future times.
        if "exp" in decoded_token:
            exp_time = int(decoded_token["exp"])
            future_time = max(0, future_time)
            current_time = time.time() + future_time
            if exp_time < current_time:
                raise AuthExceptions.INVALID_TOKEN.override_message(
                    f"Token has expired. exp time: {exp_time} and current time: {current_time}."
                )

    except jwt.ExpiredSignatureError as e:
        print(f"Caught Exception: {str(e)}")
        traceback.print_exc()
        raise AuthExceptions.INVALID_TOKEN.append_message(str(e))
    except Exception as e:
        raise AuthExceptions.INVALID_TOKEN.append_message(str(e))

    return decoded_token


def extract_json(event, key: str):
    try:
        event_body = event[key]
        json_body = json.loads(event_body) if type(event_body) is str else event_body
    except Exception as e:
        raise HandlerException(400, f"Unable to parse JSON data of {key}: {e}")
    return json_body
