import AuthResponse from "./AuthResponse";
import AuthApi from "./AuthApi";
import { AuthState, AuthStateUtility } from "./AuthState";

class AuthLocalApi {
  private stateUtil: AuthStateUtility;
  private setAuthState: (x: AuthState) => void;

  constructor(
    stateUtil: AuthStateUtility,
    setAuthState: (x: AuthState) => void
  ) {
    this.stateUtil = stateUtil;
    this.setAuthState = setAuthState;
  }

  public getState(): AuthState {
    return this.stateUtil.state;
  }

  public signIn(email: string, password: string): Promise<AuthResponse> {
    return this.withSideEffect(AuthApi.signIn(email, password), (x) => {
      console.log(x);
      const newState = this.stateUtil.withToken(x.token);
      newState.save();
      console.log("Setting new Auth State...");
      console.log(newState.state);
      this.setAuthState(newState.state);
    });
  }

  public signOut(): void {
    this.stateUtil.clear();
    this.setAuthState(this.stateUtil.newDefaultState());
  }

  protected withSideEffect<T>(
    p: Promise<T>,
    executor: (x: T) => void
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      p.then((r: T) => {
        executor(r);
        resolve(r);
      }).catch(reject);
    });
  }
}

export default AuthLocalApi;
