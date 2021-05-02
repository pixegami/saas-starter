from auth_handler_base import AuthHandlerBase
from handler_exception import HandlerException
from return_message import new_return_message
from request_account_verification_token import request_account_verification_token


class RequestAccountVerificationHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"account_key": True}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        account_key = request_data["account_key"]
        auth_user = self.get_credentials_from_key(account_key)
        email = auth_user.user
        should_return_verification_tokens = self.is_test_user(email)

        # Validation.
        self.validator.email_regex(email)

        # User is already verified, this should fail.
        if auth_user.verified:
            raise HandlerException(400, "This user has already been verified.")

        verification_token, verification_url = request_account_verification_token(
            self, email, account_key
        )

        # Return a response.
        if should_return_verification_tokens:
            response_payload = {
                "verification_token": verification_token,
                "verification_url": verification_url,
            }
        else:
            response_payload = {}

        return new_return_message(
            200,
            f"Verification token created for account. [{account_key}]",
            response_payload,
        )
