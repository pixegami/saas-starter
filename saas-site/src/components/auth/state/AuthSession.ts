import * as jwt from "jsonwebtoken";
import { AuthContextState } from "../api/AuthContext";

interface AuthSessionProps {
  authState: AuthContextState;
  setAuthState: (x: AuthContextState) => void;
}

class AuthSession {
  private static SESSION_STORAGE_NAME: string = "ss_pixegami_auth_session";

  private static TOKEN_VERIFIED_PROPERTY: string = "verified";
  private static TOKEN_USER_PROPERTY: string = "user";
  private static TOKEN_ACCOUNT_KEY_PROPERTY: string = "account_key";

  private static IS_BROWSER = typeof window !== "undefined";

  private token: string | undefined;
  private verified: boolean = false;
  private userEmail: string | undefined;
  private userAccountKey: string | undefined;
  private tokenPayload: any;

  private authState: AuthContextState;
  private setAuthState: (x: AuthContextState) => void;

  constructor(props: AuthSessionProps) {
    this.authState = props.authState;
    this.setAuthState = props.setAuthState;
  }

  public static restoreOrNew(props: AuthSessionProps): AuthSession {
    // Try loading it from storage.
    const sessionString = this.IS_BROWSER
      ? window.localStorage.getItem(AuthSession.SESSION_STORAGE_NAME)
      : null;

    const authSession: AuthSession = new AuthSession(props);

    if (sessionString !== null && sessionString.length > 0) {
      // Parse the session.
      console.log(`Loading Session from Memory: ${sessionString}`);
      const jsonObject = JSON.parse(sessionString);
      // authSession.setToken(jsonObject.token);
      return authSession;
    } else {
      // Create a new empty session.
      console.log(`Creating new session.`);
      return authSession;
    }
  }

  // public setToken(token: string): AuthSession {
  //   this.token = token;
  //   this.setTokenPayloadFromToken(token);
  //   this.setAuthState({ ...this.authState, token: token, hasToken: true });
  //   return this;
  // }

  public getToken(): string | undefined {
    return this.token;
  }

  public getTokenPayload(): any {
    return this.tokenPayload;
  }

  public getUserEmail(): string | undefined {
    return this.userEmail;
  }

  public getUserAccountKey(): string | undefined {
    return this.userAccountKey;
  }

  public isVerified(): boolean {
    return this.verified;
  }

  private setTokenPayloadFromToken(token: string) {
    const payload = jwt.decode(token);
    if (payload === null) {
      throw new Error("Unable to decode user token.");
    } else {
      this.tokenPayload = jwt.decode(token);
      this.verified = this.valueFromPayload(
        this.tokenPayload,
        AuthSession.TOKEN_VERIFIED_PROPERTY,
        false
      );

      this.userEmail = this.valueFromPayload(
        this.tokenPayload,
        AuthSession.TOKEN_USER_PROPERTY,
        undefined
      );

      this.userAccountKey = this.valueFromPayload(
        this.tokenPayload,
        AuthSession.TOKEN_ACCOUNT_KEY_PROPERTY,
        undefined
      );

      console.log("Loaded email: " + this.userEmail);
      console.log("Loaded account key: " + this.userAccountKey);
      console.log("Loaded verification status: " + this.verified);
    }
  }

  private valueFromPayload(payload: any, key: string, defaultValue: any) {
    return payload.hasOwnProperty(key) ? payload[key] : defaultValue;
  }

  public static clear(): void {
    if (this.IS_BROWSER) {
      window.localStorage.removeItem(this.SESSION_STORAGE_NAME);
    }
  }

  public save(): AuthSession {
    // Save session to local storage.
    if (AuthSession.IS_BROWSER) {
      window.localStorage.setItem(
        AuthSession.SESSION_STORAGE_NAME,
        this.serialize()
      );
      console.log(`Saved Session: ${this.serialize()}`);
    }
    return this;
  }

  private serialize(): string {
    const jsonObject = { token: this.token };
    return JSON.stringify(jsonObject);
  }
}

export default AuthSession;
