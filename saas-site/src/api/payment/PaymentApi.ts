import ApiResponse from "../base/ApiResponse";
import BaseApi from "../base/BaseApi";
import * as jwt from "jsonwebtoken";

class PaymentApi extends BaseApi {
  private static ENDPOINT: string = "https://api.bonestack.com/auth";
  protected static getEndpoint(): string {
    return this.ENDPOINT;
  }

  public static requestCheckout(): Promise<ApiResponse> {
    console.log("Creating Checkout Session");

    return this.getRequest("create_payment_session", {});
  }
}

export default PaymentApi;
