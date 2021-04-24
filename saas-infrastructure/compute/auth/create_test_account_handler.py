import json
import time
from auth_handler_base import AuthHandlerBase, AuthUser
from sign_up_handler import SignUpHandler
import uuid


class CreateTestAccountHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"user": True, "password": True, "flags": False}

    def handle_action(self, request_data: dict, event: dict, context: dict):
        sign_up_handler = SignUpHandler()
        # Force add TMP and CONFIRMED flags.
        request_data["flags"] = ["TMP", "AUTO_VERIFY"]
        return sign_up_handler.handle_action(request_data, event, context)
