import ApiResponse from "../base/ApiResponse";
import BaseApi from "../base/BaseApi";
import * as jwt from "jsonwebtoken";
import AuthApi from "../auth/AuthApi";
import { loadStripe } from "@stripe/stripe-js";

class PaymentApi extends BaseApi {
  private static ENDPOINT: string = "https://api.bonestack.com/auth";
  private static STRIPE_PUBLIC_KEY: string =
    "pk_test_aKOhvFXppSG39jKNDvVi3tYT006IbA5jQL";

  protected static getEndpoint(): string {
    return this.ENDPOINT;
  }

  public static async redirectToCheckout(sessionId: string) {
    const stripe = await loadStripe(PaymentApi.STRIPE_PUBLIC_KEY);
    const { error } = await stripe.redirectToCheckout({ sessionId });
    alert(error.message);
  }

  public static requestCheckout(): Promise<ApiResponse> {
    console.log(
      "Creating Checkout Session with token " + AuthApi.getSession().getToken()
    );
    return this.getRequest(
      "create_payment_session",
      {},
      AuthApi.getSession().getToken()
    );
  }

  public static async requestCheckoutAndRedirect(): Promise<void> {
    const response = await this.requestCheckout();
    console.log("Payment session created: " + response.payload);
    await this.redirectToCheckout(response.payload["session_id"]);
  }

  // TODO: Add response transformer for PaymentResponse.
}

export default PaymentApi;
