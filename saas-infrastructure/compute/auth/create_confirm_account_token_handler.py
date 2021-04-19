import json
import time
from auth_handler_base import AuthHandlerBase
import uuid
import secrets
import os
from email_sender import EmailSender, EmailProps
import time
from handler_exception import HandlerException
from return_message import new_return_message


class CreateConfirmAccountTokenHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"account_key": True}
        self.email_source: str = os.getenv("EMAIL_SOURCE", "accounts@pixegami.com")
        self.endpoint: str = os.getenv("ENDPOINT", "UNKNOWN")
        self.frontend_url: str = os.getenv("FRONTEND_URL", "UNKNOWN")

    def handle_action(self, request_data: dict, event: dict, context: dict):

        account_key = request_data["account_key"]
        auth_user = self.get_credentials_from_key(account_key)

        # User is already confirmed, this should fail.
        if auth_user.confirmed:
            raise HandlerException(400, "This user has already been confirmed.")

        # Operation
        token = secrets.token_hex()
        self.put_token(account_key, "TOKEN.CONFIRM_ACCOUNT", token)

        confirm_url: str = (
            f"{self.endpoint}?operation=confirm_account&confirm_token={token}"
        )

        confirm_frontend_url: str = (
            f"{self.frontend_url}verify_account_result?key={token}"
        )

        # Fire off the email.
        self.send_confirmation_email(auth_user.user, confirm_url, confirm_frontend_url)

        # Return a response.
        response_payload = {
            "confirm_token": token,
            "confirm_url": confirm_url,
            "confirm_frontend_url": confirm_frontend_url,
        }
        return new_return_message(
            200,
            f"Confirm account token created for account. [{account_key} / {token}]",
            response_payload,
        )

    def send_confirmation_email(
        self, email: str, confirm_url: str, confirm_frontend_url: str
    ):

        email_sender = EmailSender()
        email_props = EmailProps()
        email_props.subject = "Confirm your account at [SERVICE]"
        email_props.source = self.email_source
        email_props.text = f"Please click here to confirm your account: {confirm_frontend_url} direct api: {confirm_url}"
        email_props.html = f"<div>Please click here to confirm your account: <a href='{confirm_frontend_url}'>Confirm Account</a> <a href='{confirm_url}'>Confirm API Account</a></div>"
        email_props.to_addresses = [email]
        email_props.reply_to = []

        email_sender.send_email(email_props)
