from auth_handler_base import AuthHandlerBase, AuthUser
import stripe
from return_message import new_return_message
from request_account_verification_token import request_account_verification_token
import time


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
        client_reference_id = None
        new_expiry_time = None

        if stripe_event.type == "payment_intent.succeeded":
            print("Payment intent succeeded received")
        elif stripe_event.type == "payment_method.attached":
            print("Attached")
        elif stripe_event.type == "checkout.session.completed":
            print(f"Checkout complete: {stripe_object}")
            client_reference_id = (
                stripe_object["client_reference_id"]
                if "client_reference_id" in stripe_object
                else "unknown"
            )
            new_expiry_time = self.enable_client_subscription(client_reference_id)

        elif stripe_event.type == "payment_intent.succeeded":
            print(f"Invoice Paid: {stripe_object}")

        else:
            print("Unhandled event type {}".format(stripe_event.type))

        print(f"Request data: {request_data}")
        response_payload = {
            "event_type": stripe_event.type,
            "client_id": client_reference_id,
            "new_expiry_time": new_expiry_time,
            "data.object": stripe_object,
        }

        return new_return_message(
            200,
            "Stripe Webhook Success",
            response_payload,
        )

    def enable_client_subscription(self, client_reference_id: str):
        membership_days = 32
        days_to_seconds = 86400
        new_expiry_time = int(time.time() + membership_days * days_to_seconds)
        self.update_user_membership(client_reference_id, new_expiry_time)
        return new_expiry_time
