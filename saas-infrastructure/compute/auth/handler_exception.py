from return_message import new_return_message
from typing import Optional


class HandlerException(Exception):
    def __init__(self, status_code: int, message: str, payload: Optional[dict] = None):
        super().__init__(message)
        self.status_code = status_code
        self.message = message
        self.payload = payload

    def as_api_response(self):
        return new_return_message(self.status_code, self.message, self.payload)

    def append_message(self, new_message: str):
        appended_message = " ".join([self.message, new_message])
        return HandlerException(self.status_code, appended_message, self.payload)

    def override_message(self, new_message: str):
        return HandlerException(self.status_code, new_message, self.payload)

    def override_status(self, new_status: int):
        return HandlerException(new_status, self.message, self.payload)