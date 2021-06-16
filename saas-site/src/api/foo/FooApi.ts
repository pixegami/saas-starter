import AuthApi from "../auth/AuthApi";
import BaseApi from "../base/BaseApi";
import FooResponse, { withFooResponse } from "./FooResponse";

class FooApi extends BaseApi {
  // Configurable fields.
  private static ENDPOINT: string = "https://api.bonestack.com/foo";

  protected static getEndpoint(): string {
    return this.ENDPOINT;
  }

  public static foo(): Promise<FooResponse> {
    const token = AuthApi.getSessionToken();
    console.log("Calling Foo with token " + token);
    const responsePromise = this.getRequest("foo", {}, token);
    const sideEffectPromise = this.withSideEffect(responsePromise, (x) => {
      if (x.status == 200) {
      }
    });

    return withFooResponse(sideEffectPromise);
  }
}

export default FooApi;
