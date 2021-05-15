import traceback
import os
import json
import jwt

from auth_exceptions import AuthExceptions
from handler_exception import HandlerException


JWT_HASH_KEY = os.getenv("AUTH_SECRET")


def validate_token(event):
    try:
        print(f"Got Event: {event}")
        headers = extract_json(event, "headers")
        auth_header = headers["Authorization"]
        token = auth_header.split(" ")[1]
    except Exception as e:
        raise AuthExceptions.MISSING_HEADER

    try:
        decoded_token = jwt.decode(token, JWT_HASH_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError as e:
        print(f"Caught Exception: {str(e)}")
        traceback.print_exc()
        raise AuthExceptions.INVALID_TOKEN
    except Exception as e:
        raise AuthExceptions.INVALID_TOKEN

    return decoded_token


def extract_json(event, key: str):
    try:
        event_body = event[key]
        json_body = json.loads(event_body) if type(event_body) is str else event_body
    except Exception as e:
        raise HandlerException(400, f"Unable to parse JSON data of {key}: {e}")
    return json_body
