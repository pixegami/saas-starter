from verification.request_account_verification_token import (
    request_account_verification_token,
)

from base.auth_handler import AuthHandler
from api_utils import ApiException, api_response


class RequestAccountVerificationHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.schema = {"account_key"}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        account_key = request_data["account_key"]
        user = self.get_user_by_key(account_key)
        should_return_verification_tokens = self.is_test_user(user.email)

        # Validation.
        self.validator.email_regex(user.email)

        # User is already verified, this should fail.
        if user.verified:
            raise ApiException(400, "This user has already been verified.")

        verification_token, verification_url = request_account_verification_token(
            self, user.email, account_key
        )

        # Return a response.
        if should_return_verification_tokens:
            response_payload = {
                "verification_token": verification_token,
                "verification_url": verification_url,
            }
        else:
            response_payload = {}

        return api_response(
            200,
            f"Verification token created for account. [{account_key}]",
            response_payload,
        )
