from handler_base import HandlerBase
from sign_in_handler import SignInHandler
from sign_up_handler import SignUpHandler
from create_confirm_account_token_handler import CreateConfirmAccountTokenHandler
from create_reset_token_handler import CreateResetTokenHandler
from reset_account_handler import ResetAccountHandler
from confirm_account_handler import ConfirmAccountHandler
from validate_token_handler import ValidateTokenHandler
from create_test_account_handler import CreateTestAccountHandler
from handler_exception import HandlerException


def handler(event, context=None):
    return EntryPointHandler().handle(event, context)


class EntryPointHandler(HandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"operation": True}
        self.operation_map = {
            "sign_in": SignInHandler(),
            "sign_up": SignUpHandler(),
            "request_account_confirmation": CreateConfirmAccountTokenHandler(),
            "confirm_account": ConfirmAccountHandler(),
            "request_account_reset": CreateResetTokenHandler(),
            "reset_account": ResetAccountHandler(),
            "validate_token": ValidateTokenHandler(),
            "create_test_account": CreateTestAccountHandler(),
        }

    def handle_action(self, request_data: dict, event: dict, context: dict):
        operation = request_data["operation"]

        if operation not in self.operation_map.keys():
            raise HandlerException(400, f"Unknown operation: {operation}")

        operation_handler = self.operation_map[operation]
        return operation_handler.handle(event, context)