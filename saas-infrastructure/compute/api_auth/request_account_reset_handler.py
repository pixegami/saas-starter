import secrets
import os

from auth_handler_base import AuthHandler
from email_sender import EmailSender, EmailProps
from return_message import new_return_message
from token_keys import TokenKeys


class RequestAccountResetHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.schema = {"user": True}
        self.email_source: str = os.getenv("EMAIL_SOURCE")
        self.endpoint: str = os.getenv("ENDPOINT", "UNKNOWN")
        self.frontend_url: str = os.getenv("FRONTEND_URL", "UNKNOWN")

    def handle_action(self, request_data: dict, event: dict, context: dict):

        user_email = str(request_data["user"]).lower()

        # Validation.
        self.validator.email_regex(user_email)

        # Get what we need to reset the account.
        auth_user = self.get_user_credentials(user_email)
        should_return_tokens = self.is_test_user(user_email)
        token = secrets.token_hex()
        self.put_token(auth_user.key, TokenKeys.TOKEN_RESET, token)
        reset_url: str = f"{self.endpoint}?operation=reset_account&reset_url={token}"
        reset_frontend_url: str = f"{self.frontend_url}reset_password?key={token}"

        # Fire off the email.
        self.send_reset_email(user_email, reset_frontend_url)

        # Return a response.
        if should_return_tokens:
            response_payload = {"reset_token": token, "reset_url": reset_url}
        else:
            response_payload = {}

        return new_return_message(
            200,
            f"Reset account token created for account. [{user_email}]",
            response_payload,
        )

    def send_reset_email(self, email: str, reset_frontend_url: str):

        email_sender = EmailSender()
        email_props = EmailProps()
        email_props.subject = "Reset your account password at [SERVICE]"
        email_props.source = self.email_source
        email_props.text = (
            f"Please click here to reset your account: {reset_frontend_url}"
        )
        email_props.html = f"<div>Please click here to reset your account: <a href='{reset_frontend_url}'>Reset Account</a></div>"
        email_props.to_addresses = [email]
        email_props.reply_to = []

        email_sender.send_email(email_props)
