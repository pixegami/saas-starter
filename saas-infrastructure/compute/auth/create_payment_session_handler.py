from auth_handler_base import AuthHandlerBase
from return_message import new_return_message
import stripe
import os


class CreatePaymentSessionHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"return_endpoint": False, "flags": False}
        stripe.api_key = "sk_test_dVPxaaBuDLylUmztkCmomO0p00dyqHOvDf"
        self.frontend_url: str = os.getenv("FRONTEND_URL", "UNKNOWN")

    def handle_action(self, request_data: dict, event: dict, context: dict):

        price_id = "price_1Ipw2ECCoJYujIqgPAGPkuYZ"
        return_endpoint = request_data.get("return_endpoint", None)
        if return_endpoint is None:
            return_endpoint = self.frontend_url

        checkout_session = stripe.checkout.Session.create(
            success_url=f"{return_endpoint}/success?session_id={'{CHECKOUT_SESSION_ID}'}",
            cancel_url=f"{return_endpoint}/cancel",
            payment_method_types=["card"],
            mode="subscription",
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                }
            ],
        )

        response_payload = {"session_id": checkout_session["id"]}

        return new_return_message(
            200,
            "Successfully created payment session.",
            response_payload,
        )
