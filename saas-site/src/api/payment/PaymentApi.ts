import ApiResponse from "../base/ApiResponse";
import BaseApi from "../base/BaseApi";
import * as jwt from "jsonwebtoken";
import AuthApi from "../auth/AuthApi";

class PaymentApi extends BaseApi {
  private static ENDPOINT: string = "https://api.bonestack.com/auth";
  protected static getEndpoint(): string {
    return this.ENDPOINT;
  }

  public static requestCheckout(): Promise<ApiResponse> {
    console.log("Creating Checkout Session");
    return this.getRequest("create_payment_session", {
      token: AuthApi.getSession().getToken(),
    });
  }

  // TODO: Add response transformer for PaymentResponse.
}

export default PaymentApi;
