import ApiResponse from "../base/ApiResponse";
import BaseApi from "../base/BaseApi";
import AuthResponse from "./AuthResponse";
import AuthSession from "./AuthSession";
import * as jwt from "jsonwebtoken";

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
      if (x.status == 200) {
        this.getSession().setToken(x.payload.token).save();
      }
    });

    return this.withResponseTransformer(sideEffectPromise);
  }

  public static fakeSignIn(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    console.log("Signing in!");

    const fakeToken = jwt.sign(
      { confirmed: false, user: "blah@fake.com" },
      "myFakeSecret"
    );

    const response: ApiResponse = {
      status: 200,
      message: "Fake operation succeeded!",
      payload: { token: fakeToken, email: email },
    };

    const fakePromise = this.genericFakePromise((resolve, _reject) =>
      resolve(response)
    );

    const sideEffectPromise = this.withSideEffect(fakePromise, (x) =>
      this.getSession().setToken(x.payload.token).save()
    );

    return this.withResponseTransformer(sideEffectPromise);
  }

  public static signUp(email: string, password: string): Promise<AuthResponse> {
    const signUpPromise = this.postRequest("sign_up", {
      user: email,
      password: password,
    });

    const sideEffectPromise = this.withSideEffect(signUpPromise, (x) => {
      if (x.status == 200) {
        this.getSession().setToken(x.payload.token).save();
      }
    });

    return this.withResponseTransformer(signUpPromise);
  }

  public static signOut(): void {
    this.clearSession();
  }

  public static validate(): Promise<ApiResponse> {
    console.log(`Validating With Token: ...`);
    return this.getRequest("validate_token", {}, this.getSession().getToken());
  }

  public static getSession() {
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
    return this.getSession().getToken();
  }

  public static hasSessionToken(): boolean {
    return this.getSessionToken() ? true : false;
  }

  public static isSignedIn(): boolean {
    return this.hasSessionToken();
  }

  public static isAccountVerified(): boolean {
    return this.isSignedIn() && this.getSession().isVerified();
  }
}

export default AuthApi;
