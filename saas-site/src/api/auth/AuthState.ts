import StateUtility from "./StateUtility";

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

  public static fromState(x: AuthState) {
    return new AuthStateUtility(x);
  }

  public deserialize(x: string): AuthState {
    return this.newDefaultState();
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
