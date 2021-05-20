from handler_base import HandlerBase
from sign_in_handler import SignInHandler
from sign_up_handler import SignUpHandler
from request_account_verification_handler import RequestAccountVerificationHandler
from request_account_reset_handler import RequestAccountResetHandler
from reset_account_handler import ResetAccountHandler
from verify_account_handler import VerifyAccountHandler
from validate_token_handler import ValidateTokenHandler
from create_test_account_handler import CreateTestAccountHandler
from handler_exception import HandlerException
from create_payment_session_handler import CreatePaymentSessionHandler
from validate_membership_handler import ValidateMembershipHandler


def handler(event, context=None):
    return EntryPointHandler().handle(event, context)


class EntryPointHandler(HandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"operation": True}
        self.operation_map = {
            "sign_in": SignInHandler(),
            "sign_up": SignUpHandler(),
            "request_account_verification": RequestAccountVerificationHandler(),
            "verify_account": VerifyAccountHandler(),
            "request_account_reset": RequestAccountResetHandler(),
            "reset_account": ResetAccountHandler(),
            "validate_token": ValidateTokenHandler(),
            "create_test_account": CreateTestAccountHandler(),
            "create_payment_session": CreatePaymentSessionHandler(),
            "validate_membership": ValidateMembershipHandler(),
        }

    def handle_action(self, request_data: dict, event: dict, context: dict):
        operation = request_data["operation"]

        if operation not in self.operation_map.keys():
            raise HandlerException(400, f"Unknown operation: {operation}")

        operation_handler = self.operation_map[operation]
        return operation_handler.handle(event, context)