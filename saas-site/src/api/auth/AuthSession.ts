class AuthSession {
  private static SESSION_STORAGE_NAME: string = "ss_pixegami_auth_session";

  private token: string | undefined;

  public save(): AuthSession {
    // Save session to local storage.
    window.localStorage.setItem(
      AuthSession.SESSION_STORAGE_NAME,
      this.serialize()
    );
    console.log(`Saved Session: ${this.serialize()}`);
    return this;
  }

  public setToken(token: string): AuthSession {
    this.token = token;
    return this;
  }

  public getToken(): string {
    return this.token;
  }

  public static restoreOrNew(): AuthSession {
    // Try loading it from storage.
    const sessionString = window.localStorage.getItem(
      AuthSession.SESSION_STORAGE_NAME
    );
    if (sessionString !== null && sessionString.length > 0) {
      // Parse the session.
      console.log(`Loading Session from Memory: ${sessionString}`);
      return this.parse(sessionString);
    } else {
      // Create a new empty session.
      console.log(`Creating a new session.`);
      return new AuthSession();
    }
  }

  public static clear(): void {
    window.localStorage.removeItem(this.SESSION_STORAGE_NAME);
  }

  private serialize(): string {
    const jsonObject = { token: this.token };
    return JSON.stringify(jsonObject);
  }

  private static parse(sessionString: string): AuthSession {
    const jsonObject = JSON.parse(sessionString);
    const authSession: AuthSession = new AuthSession();
    authSession.token = jsonObject.token;
    return authSession;
  }
}

export default AuthSession;
