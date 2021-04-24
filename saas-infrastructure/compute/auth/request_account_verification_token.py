import os
import secrets
from token_keys import TokenKeys
from email_sender import EmailProps, EmailSender


def request_account_verification_token(auth_handler, email: str, account_key: str):

    # Get the ENDPOINTS.
    endpoint: str = os.getenv("ENDPOINT", "UNKNOWN")
    frontend_url: str = os.getenv("FRONTEND_URL", "UNKNOWN")

    # Operation
    token = secrets.token_hex()
    auth_handler.put_token(account_key, TokenKeys.TOKEN_VERIFY, token)
    confirm_url: str = f"{endpoint}?operation=verify_account&verification_token={token}"
    confirm_frontend_url: str = f"{frontend_url}verify_account?key={token}"

    # Fire off the email.
    send_confirmation_email(email, confirm_frontend_url)
    return token, confirm_url


def send_confirmation_email(email: str, confirm_frontend_url: str):

    email_source: str = os.getenv("EMAIL_SOURCE", "accounts@pixegami.com")
    email_sender = EmailSender()
    email_props = EmailProps()
    email_props.subject = "Confirm your account at [SERVICE]"
    email_props.source = email_source
    email_props.text = (
        f"Please click here to confirm your account: {confirm_frontend_url}"
    )
    email_props.html = f"<div>Please click here to confirm your account: <a href='{confirm_frontend_url}'>Confirm Account</a></div>"
    email_props.to_addresses = [email]
    email_props.reply_to = []
    email_sender.send_email(email_props)
