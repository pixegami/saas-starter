import StateUtility from "../../util/state/StateUtility";
import * as jwt from "jsonwebtoken";

export interface AuthState {
  hasToken: boolean;
  firstLoad: boolean;
  token?: string;
}

export interface AuthTokenPayload {
  userEmail?: string;
  accountKey?: string;
}

export class AuthStateUtility extends StateUtility<AuthState> {
  private static TOKEN_USER_PROPERTY: string = "user";
  private static TOKEN_ACCOUNT_KEY_PROPERTY: string = "account_key";
  public readonly payload: AuthTokenPayload;

  constructor(state?: AuthState) {
    super(state);

    if (state && state.token) {
      this.payload = this.payloadFromToken(state.token);
    } else {
      this.payload = {};
    }
  }

  public newDefaultState(): AuthState {
    return {
      hasToken: false,
      firstLoad: true,
    };
  }

  public deserialize(x: any): AuthState {
    const newState: AuthState = {
      ...this.newDefaultState(),
      token: x.token,
      hasToken: x.token ? true : false,
    };
    return newState;
  }

  public serialize(): string {
    return JSON.stringify({ token: this.state.token });
  }

  public withToken(token: string): AuthStateUtility {
    const newRawState: AuthState = {
      ...this.state,
      hasToken: token ? true : false,
      token: token,
    };
    return new AuthStateUtility(newRawState);
  }

  private payloadFromToken(token: string) {
    const rawPayload = jwt.decode(token);
    if (rawPayload === null) {
      throw new Error("Unable to decode user token.");
    } else {
      const payload: AuthTokenPayload = {
        userEmail: this.valueFromPayload(
          rawPayload,
          AuthStateUtility.TOKEN_USER_PROPERTY,
          undefined
        ),
        accountKey: this.valueFromPayload(
          rawPayload,
          AuthStateUtility.TOKEN_ACCOUNT_KEY_PROPERTY,
          undefined
        ),
      };
      return payload;
    }
  }

  private valueFromPayload(payload: any, key: string, defaultValue: any) {
    return payload.hasOwnProperty(key) ? payload[key] : defaultValue;
  }
}
