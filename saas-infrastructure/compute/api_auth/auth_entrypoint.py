from account import *
from api_utils import ApiEntrypoint


def handler(event, context=None):

    entry_point = (
        ApiEntrypoint()
        .with_handler(SignUpHandler())
        .with_handler(SignInHandler())
        # .with_operation("sign_in", SignInHandler())
        # .with_operation(
        #     "request_account_verification", RequestAccountVerificationHandler()
        # )
        # .with_operation("verify_account", VerifyAccountHandler())
        # .with_operation("request_account_reset", RequestAccountResetHandler())
        # .with_operation("reset_account", ResetAccountHandler())
        # .with_operation("validate_token", ValidateTokenHandler())
        # .with_operation("create_test_account", CreateTestAccountHandler())
        # .with_operation("create_payment_session", CreatePaymentSessionHandler())
        # .with_operation("create_payment_portal_session", CreatePaymentPortalHandler())
        # .with_operation("validate_membership", ValidateMembershipHandler())
        # .with_operation("get_verification_status", GetVerificationStatusHandler())
    )

    # "foo": FooHandler(),
    # "foo_write_post": FooWritePostHandler(),
    # "foo_get_posts": FooGetPostsHandler(),
    # "foo_get_post": FooGetPostHandler(),

    return entry_point.handle(event, context)
