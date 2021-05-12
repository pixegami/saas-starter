from auth_handler_base import AuthHandlerBase, AuthUser
import stripe
from return_message import new_return_message
from request_account_verification_token import request_account_verification_token
import json


def handle(event, context):
    return StripeWebhookHandler().handle(event, context)


class StripeWebhookHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {}
        stripe.api_key = "sk_test_dVPxaaBuDLylUmztkCmomO0p00dyqHOvDf"

    def handle_action(self, request_data: dict, event: dict, context: dict):

        try:
            stripe_event = stripe.Event.construct_from(request_data, stripe.api_key)
        except ValueError as e:
            # Invalid payload
            return new_return_message(400, f"Stripe Webhook Failed: {e}")

        print(f"Handling event: {stripe_event.type }")
        stripe_object = stripe_event.data.object

        if stripe_event.type == "payment_intent.succeeded":
            # Then define and call a method to handle the successful payment intent.
            # handle_payment_intent_succeeded(payment_intent)
            print("Payment intent succeeded received")
        elif stripe_event.type == "payment_method.attached":
            print("Attached")
            # handle_payment_method_attached(payment_method)
            # ... handle other event types
        elif stripe_event.type == "checkout.session.completed":
            print(f"Checkout complete: {stripe_object}")
            # Do something to update the server.

        elif stripe_event.type == "payment_intent.succeeded":
            print(f"Invoice Paid: {stripe_object}")

        else:
            print("Unhandled event type {}".format(stripe_event.type))

        print(f"Request data: {request_data}")
        response_payload = {}
        return new_return_message(
            200,
            "Stripe Webhook Success",
            response_payload,
        )
