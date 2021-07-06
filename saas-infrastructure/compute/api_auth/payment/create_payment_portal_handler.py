import stripe
import os
from base.auth_handler import AuthHandler
from api_utils import api_response
import urllib.parse


class CreatePaymentPortalHandler(AuthHandler):
    def __init__(self):
        super().__init__()
        self.operation_name = "create_payment_portal"
        self.schema = {"return_endpoint", "flags"}
        stripe.api_key = "sk_test_dVPxaaBuDLylUmztkCmomO0p00dyqHOvDf"
        self.frontend_url: str = os.getenv("FRONTEND_URL", "UNKNOWN")

    def handle_action(self, request_data: dict, event: dict, context: dict):

        token = self.verify_token(event)
        account_key = token.account_id
        customer_id = self.get_stripe_customer_id(account_key)

        return_endpoint = request_data.get("return_endpoint", None)
        if return_endpoint is None:
            return_endpoint = self.frontend_url

        profile_url = urllib.parse.urljoin(return_endpoint, "profile")

        session = stripe.billing_portal.Session.create(
            customer=customer_id, return_url=profile_url
        )

        response_payload = {
            "session_url": session["url"],
            "token_payload": token.serialize(),
            "account_key": account_key,
            "customer_id": customer_id,
        }

        return api_response(
            200,
            "Successfully created payment portal session.",
            response_payload,
        )
