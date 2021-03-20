class Auth {
  public static isSignedIn(): boolean {
    return false;
  }

  public static signIn(x: string): void {
    console.log(`Sign in with: ${x}`);
  }
}

export default Auth;
