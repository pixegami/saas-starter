import ApiResponse from "../ApiResponse";
import BaseApi from "../BaseApi";
import AuthSession from "./AuthSession";

class AuthApi extends BaseApi {
  // Configurable fields.
  private static ENDPOINT: string = "https://api.ss.pixegami.com/auth";

  // Functional fields.
  private static SESSION: AuthSession | null = null;

  protected static getEndpoint(): string {
    return this.ENDPOINT;
  }

  public static signIn(email: string, password: string): Promise<ApiResponse> {
    console.log("Signing in!");
    return this.withSideEffect(
      this.getRequest("sign_in", { user: email, password: password }),
      (x) => {
        this.getSession().token = x.payload.token;
        console.log(`Executing Side Effect: ${x.payload.token}`);
      }
    );
  }

  public static signUp(email: string, password: string): Promise<ApiResponse> {
    console.log(`Registering: ${email} : ${password}`);
    return this.postRequest("sign_up", { user: email, password: password });
  }

  public static validate(): Promise<ApiResponse> {
    console.log(`Validating With Token: ...`);
    return this.getRequest("validate_token", {}, this.getSession().token);
  }

  private static getSession() {
    if (AuthApi.SESSION === null) {
      this.SESSION = AuthSession.restoreOrNew();
    }
    return this.SESSION;
  }

  public static clearSession() {
    AuthSession.clear();
    this.SESSION = new AuthSession();
  }

  public static isSignedIn = (): boolean => {
    if (AuthApi.getSession()) {
      if (AuthApi.getSession().token) {
        return true;
      }
    }
    return false;
  };
}

export default AuthApi;
