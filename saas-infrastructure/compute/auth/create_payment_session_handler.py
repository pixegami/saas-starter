from auth_handler_base import AuthHandlerBase
from return_message import new_return_message
import stripe


class CreatePaymentSessionHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"price_id": True, "flags": False}
        stripe.api_key = "sk_test_dVPxaaBuDLylUmztkCmomO0p00dyqHOvDf"

    def handle_action(self, request_data: dict, event: dict, context: dict):

        price_id = request_data["price_id"]
        flags = request_data["flags"] if "flags" in request_data else []

        checkout_session = stripe.checkout.Session.create(
            success_url="https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="https://example.com/canceled.html",
            payment_method_types=["card"],
            mode="subscription",
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                }
            ],
        )

        response_payload = {"sessionId": checkout_session["id"]}

        return new_return_message(
            200,
            "Successfully created payment session.",
            response_payload,
        )
