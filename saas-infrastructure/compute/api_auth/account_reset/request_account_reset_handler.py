import secrets
import os

from base.auth_handler import AuthHandler
from verification.email_sender import EmailSender, EmailProps
from api_utils import api_response
from model.account_reset_token import AccountResetToken


class RequestAccountResetHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.operation_name = "request_account_reset"
        self.schema = {"email"}
        self.email_source: str = os.getenv("EMAIL_SOURCE", "UNKNOWN")
        self.endpoint: str = os.getenv("ENDPOINT", "UNKNOWN")
        self.frontend_url: str = os.getenv("FRONTEND_URL", "UNKNOWN")

    def handle_action(self, request_data: dict, event: dict, context: dict):

        email = str(request_data.get("email")).lower()

        # Validation.
        self.validator.email_regex(email)

        # Get what we need to reset the account.
        user = self.get_user_by_email(email)
        should_return_tokens = self.is_test_user(email)
        reset_token = secrets.token_hex()
        self.put_account_reset_token(user.pk, reset_token)
        reset_url: str = (
            f"{self.endpoint}?operation=reset_account&reset_url={reset_token}"
        )
        reset_frontend_url: str = f"{self.frontend_url}reset_password?key={reset_token}"

        # Fire off the email.
        self.send_reset_email(email, reset_frontend_url)

        # Return a response.
        if should_return_tokens:
            response_payload = {"reset_token": reset_token, "reset_url": reset_url}
        else:
            response_payload = {}

        return api_response(
            200,
            f"Reset account token created for account. [{email}]",
            response_payload,
        )

    def put_account_reset_token(self, key: str, token: str, expiry_hours: int = 1):
        verification_token = AccountResetToken()
        verification_token.pk = key
        verification_token.token = token
        verification_token.with_x_hour_expiry(expiry_hours)
        self.user_database.put_item(verification_token)

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
