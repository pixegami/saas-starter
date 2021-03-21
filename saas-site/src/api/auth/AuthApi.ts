import ApiResponse from "../ApiResponse";
import BaseApi from "../BaseApi";
import AuthResponse from "./AuthResponse";
import AuthSession from "./AuthSession";

class AuthApi extends BaseApi {
  // Configurable fields.
  private static ENDPOINT: string = "https://api.ss.pixegami.com/auth";

  // Functional fields.
  private static SESSION: AuthSession | null = null;

  protected static getEndpoint(): string {
    return this.ENDPOINT;
  }

  public static signIn(email: string, password: string): Promise<AuthResponse> {
    console.log("Signing in!");

    const signInPromise = this.getRequest("sign_in", {
      user: email,
      password: password,
    });

    const sideEffectPromise = this.withSideEffect(signInPromise, (x) => {
      this.getSession().token = x.payload.token;
      console.log(`Executing Side Effect: ${x.payload.token}`);
    });

    return this.withResponseTransformer(sideEffectPromise);
  }

  public static signUp(email: string, password: string): Promise<ApiResponse> {
    console.log(`Registering: ${email} : ${password}`);
    return this.postRequest("sign_up", { user: email, password: password });
  }

  public static signOut(): void {
    this.clearSession();
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

  private static withResponseTransformer(
    promise: Promise<ApiResponse>
  ): Promise<AuthResponse> {
    return new Promise<AuthResponse>((resolve, reject) => {
      promise
        .then((apiResponse) => {
          const authResponse = {
            ...apiResponse,
            token: apiResponse.payload.token,
          };
          resolve(authResponse);
        })
        .catch(reject);
    });
  }

  public static clearSession() {
    AuthSession.clear();
    this.SESSION = new AuthSession();
  }

  public static getSessionToken(): string | undefined {
    return this.getSession().token;
  }

  public static hasSessionToken(): boolean {
    return this.getSessionToken() ? true : false;
  }
}

export default AuthApi;
