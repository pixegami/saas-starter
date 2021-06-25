import ApiResponse from "../base/ApiResponse";
import BaseApi from "../base/BaseApi";
import * as jwt from "jsonwebtoken";
import AuthApi from "../auth/AuthApi";
import { loadStripe } from "@stripe/stripe-js";
import { navigate } from "gatsby";

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
    const returnEndpoint: string = this.getReturnEndpoint();
    console.log(
      "Creating Checkout Session with token " +
        AuthApi.getSession().getToken() +
        " and return_endpoint: " +
        returnEndpoint
    );
    return this.postRequest(
      "create_payment_session",
      { return_endpoint: returnEndpoint },
      AuthApi.getSession().getToken()
    );
  }

  public static requestPaymentPortal(): Promise<ApiResponse> {
    const returnEndpoint: string = this.getReturnEndpoint();
    console.log(
      "Creating Payment Portal Session with token " +
        AuthApi.getSession().getToken() +
        " and return_endpoint: " +
        returnEndpoint
    );
    return this.postRequest(
      "create_payment_portal_session",
      { return_endpoint: returnEndpoint },
      AuthApi.getSession().getToken()
    );
  }

  public static async requestCheckoutAndRedirect(): Promise<void> {
    try {
      const response = await this.requestCheckout();
      console.log("Payment session created: " + response.payload);
      await this.redirectToCheckout(response.payload["session_id"]);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public static getReturnEndpoint(): string {
    return window.location.origin + "/app/";
  }

  public static async requestPaymentPortalAndRedirect(): Promise<void> {
    const response = await this.requestPaymentPortal();
    console.log("Payment portal created: " + response.payload);
    const externalUrl = response.payload["session_url"];
    navigate(externalUrl);
  }

  // TODO: Add response transformer for PaymentResponse.
}

export default PaymentApi;
