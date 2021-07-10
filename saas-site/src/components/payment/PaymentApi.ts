import { loadStripe } from "@stripe/stripe-js";
import { navigate } from "gatsby";
import BaseApi from "../util/base_api/BaseApi";
import ApiResponse from "../util/base_api/ApiResponse";

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

  public static requestCheckout(token: string): Promise<ApiResponse> {
    const returnEndpoint: string = this.getReturnEndpoint();
    return this.postRequest(
      "create_payment_session",
      { return_endpoint: returnEndpoint },
      token
    );
  }

  public static requestPaymentPortal(token: string): Promise<ApiResponse> {
    const returnEndpoint: string = this.getReturnEndpoint();
    return this.postRequest(
      "create_payment_portal",
      { return_endpoint: returnEndpoint },
      token
    );
  }

  public static async requestCheckoutAndRedirect(token: string): Promise<void> {
    try {
      const response = await this.requestCheckout(token);
      await this.redirectToCheckout(response.payload["session_id"]);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public static getReturnEndpoint(): string {
    return window.location.origin + "/app/";
  }

  public static async requestPaymentPortalAndRedirect(
    token: string
  ): Promise<void> {
    const response = await this.requestPaymentPortal(token);
    const externalUrl = response.payload["session_url"];
    navigate(externalUrl);
  }
}

export default PaymentApi;
