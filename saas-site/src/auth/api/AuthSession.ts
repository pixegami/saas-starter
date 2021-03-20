import Auth from "./Auth";

class AuthSession {
  public email?: string;
  public token: string;

  public serialize(): string {
    const jsonObject = { email: this.email, token: this.token };
    return JSON.stringify(jsonObject);
  }

  public static parse(sessionString: string): AuthSession {
    const jsonObject = JSON.parse(sessionString);
    const authSession: AuthSession = new AuthSession();
    authSession.email = jsonObject.email;
    authSession.token = jsonObject.token;
    return authSession;
  }
}

export default AuthSession;
