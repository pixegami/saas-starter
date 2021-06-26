import StateUtility from "../../util/state/StateUtility";

export interface AuthState {
  hasToken: boolean;
  token?: string;
}

export class AuthStateUtility extends StateUtility<AuthState> {
  public newDefaultState(): AuthState {
    return {
      hasToken: false,
    };
  }

  public deserialize(x: any): AuthState {
    const newState: AuthState = {
      token: x.token,
      hasToken: true,
    };
    return newState;
  }

  public serialize(): string {
    return JSON.stringify({ token: this.state.token });
  }

  public withToken(token: string): AuthStateUtility {
    const newRawState: AuthState = {
      ...this.state,
      hasToken: true,
      token: token,
    };
    return new AuthStateUtility(newRawState);
  }
}
