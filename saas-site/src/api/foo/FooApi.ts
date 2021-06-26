import AuthApi from "../auth/AuthApi";
import BaseApi from "../base/BaseApi";
import { FooResponse, withFooResponse } from "./FooResponse";

class FooApi extends BaseApi {
  // Configurable fields.
  private static ENDPOINT: string = "https://api.bonestack.com/foo";

  protected static getEndpoint(): string {
    return this.ENDPOINT;
  }

  public static foo(): Promise<FooResponse> {
    return this.callApiWithTokenAndWrappedResponse("foo", {});
  }

  public static putPost(title: string, content: string): Promise<FooResponse> {
    return this.callApiWithTokenAndWrappedResponse("foo_write_post", {
      title,
      content,
    });
  }

  public static getPosts(): Promise<FooResponse> {
    return this.callApiWithTokenAndWrappedResponse("foo_get_posts", {});
  }

  public static getPost(key: string): Promise<FooResponse> {
    return this.callApiWithTokenAndWrappedResponse("foo_get_post", { key });
  }

  private static callApiWithTokenAndWrappedResponse(
    apiName: string,
    params: any
  ): Promise<FooResponse> {
    const token = null; // AuthApi.getSessionToken();
    console.log("Calling " + apiName + " with token " + token);
    const responsePromise = this.getRequest(apiName, params, token);
    return withFooResponse(responsePromise);
  }
}

export default FooApi;
