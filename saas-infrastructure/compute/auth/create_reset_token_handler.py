import json
import time
from auth_handler_base import AuthHandlerBase
import uuid
import secrets
import os
from email_sender import EmailSender, EmailProps
import time
from return_message import new_return_message


class CreateResetTokenHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"user": True}
        self.email_source: str = os.getenv("EMAIL_SOURCE", "accounts@pixegami.com")
        self.endpoint: str = os.getenv("ENDPOINT", "UNKNOWN")
        self.frontend_url: str = os.getenv("FRONTEND_URL", "UNKNOWN")

    def handle_action(self, request_data: dict, event: dict, context: dict):

        user_email = request_data["user"]
        auth_user = self.get_user_credentials(user_email)

        token = secrets.token_hex()
        self.put_token(auth_user.key, self.TOKEN_RESET, token)
        reset_url: str = f"{self.endpoint}?operation=reset_account&reset_url={token}"
        reset_frontend_url: str = f"{self.frontend_url}reset_password?key={token}"

        # Fire off the email.
        self.send_reset_email(auth_user.user, reset_url, reset_frontend_url)

        # Return a response.
        response_payload = {
            "reset_token": token,
            "reset_url": reset_url,
            "reset_frontend_url": reset_frontend_url,
        }
        return new_return_message(
            200,
            f"Reset account token created for account. [{auth_user.key} / {token}]",
            response_payload,
        )

    def send_reset_email(self, email: str, reset_url: str, reset_frontend_url: str):

        email_sender = EmailSender()
        email_props = EmailProps()
        email_props.subject = "Reset your account password at [SERVICE]"
        email_props.source = self.email_source
        email_props.text = f"Please click here to reset your account: {reset_frontend_url} / {reset_url}"
        email_props.html = f"<div>Please click here to reset your account: <a href='{reset_frontend_url}'>Reset Account</a>< <a href='{reset_url}'>Reset Account API</a></div>"
        email_props.to_addresses = [email]
        email_props.reply_to = []

        email_sender.send_email(email_props)
