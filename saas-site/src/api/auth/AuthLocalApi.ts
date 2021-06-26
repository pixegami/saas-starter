import AuthResponse from "./AuthResponse";
import AuthApi from "./AuthApi";
import { AuthState, AuthStateUtility } from "./AuthState";

class AuthLocalApi {
  private authState: AuthStateUtility;
  private setAuthState: (x: AuthState) => void;

  constructor(
    authState: AuthStateUtility,
    setAuthState: (x: AuthState) => void
  ) {
    this.authState = authState;
    this.setAuthState = setAuthState;
  }

  public signIn(email: string, password: string): Promise<AuthResponse> {
    return this.withSideEffect(AuthApi.signIn(email, password), (x) => {
      console.log(x);
      const newState = this.authState.withToken(x.token);
      newState.save();
      console.log("Setting new Auth State...");
      console.log(newState.state);
      this.setAuthState(newState.state);
    });
  }

  public signOut(): void {
    this.authState.clear();
    this.setAuthState(this.authState.newDefaultState());
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
