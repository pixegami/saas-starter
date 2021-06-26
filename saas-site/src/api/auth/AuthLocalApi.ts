import ApiResponse from "../base/ApiResponse";
import BaseApi from "../base/BaseApi";
import AuthResponse from "./AuthResponse";
import AuthSession from "./AuthSession";
import * as jwt from "jsonwebtoken";
import AuthMembershipStatus from "./AuthMembershipStatus";
import AuthApi from "./AuthApi";
import { AuthContextState, createDefaultAuthContext } from "./AuthContext";

class AuthLocalApi {
  private authState: AuthContextState;
  private setAuthState: (x: AuthContextState) => void;
  private isBrowser: boolean = typeof window !== "undefined";
  private sessionStorageName: string = "ss_pixegami_auth_session";

  constructor(
    authState: AuthContextState,
    setAuthState: (x: AuthContextState) => void
  ) {
    this.authState = authState;
    this.setAuthState = setAuthState;
  }

  public signIn(email: string, password: string): Promise<AuthResponse> {
    return this.withSideEffect(AuthApi.signIn(email, password), (x) => {
      console.log(x);
      const newState: AuthContextState = {
        ...this.authState,
        token: x.token,
        hasToken: true,
      };
      this.save(newState);
      console.log("Setting new Auth State...");
      console.log(newState);
      this.setAuthState(newState);
    });
  }

  public signOut(): void {
    this.clear();
    this.setAuthState(createDefaultAuthContext());
  }

  public clear(): void {
    if (this.isBrowser) {
      window.localStorage.removeItem(this.sessionStorageName);
    }
  }

  public save(state: AuthContextState): void {
    if (this.isBrowser) {
      window.localStorage.setItem(
        this.sessionStorageName,
        this.serialize(state)
      );
      console.log(`Saved Session: ${this.serialize(state)}`);
    }
  }

  private serialize(state: AuthContextState): string {
    const jsonObject = { token: state.token };
    return JSON.stringify(jsonObject);
  }

  protected withSideEffect<T>(
    promise: Promise<T>,
    executor: (x: T) => void
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      promise
        .then((r) => {
          executor(r);
          resolve(r);
        })
        .catch(reject);
    });
  }
}

export default AuthLocalApi;
