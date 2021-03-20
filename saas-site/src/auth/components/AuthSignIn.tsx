import { Link, navigate } from "gatsby";
import * as React from "react";
import Auth from "../api/Auth";
import AuthApi from "../api/AuthApi";
import AuthResponse from "../api/AuthResponse";

interface AuthSignInProps {
  path: string;
}

const AuthSignIn: React.FC<AuthSignInProps> = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isBusy, setIsBusy] = React.useState(false);
  const [sessionState, setSessionState] = React.useState("");

  const onSignInResponse = (response: AuthResponse) => {
    setIsBusy(false);
    setSessionState(`Successfully signed in with token: ${response.token}`);
    console.log("Sign In Response Received!");
    console.log("Token: ", response.token);
    navigate("/app/dashboard");
  };

  const onRegisterError = (x: any) => {
    setIsBusy(false);
    setSessionState(x.toString());
    console.log("Failed to sign in.");
    console.log(x);
  };

  const onSignInSubmit = () => {
    setIsBusy(true);
    setSessionState("");
    console.log("Sign in with ", email, password);
    AuthApi.signIn(email, password)
      .then(onSignInResponse)
      .catch(onRegisterError);
  };

  const buttonStyle: string = "border m-1 p-1 border-black";
  const busyElement = isBusy ? <div>Loading</div> : null;
  const stateElement =
    sessionState.length > 0 ? <div>{sessionState}</div> : null;

  return (
    <div className="text-lg">
      <h1>This is the Auth Sign-in Page.</h1>

      <input
        className={buttonStyle}
        type="text"
        defaultValue={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <input
        className={buttonStyle}
        type="password"
        defaultValue={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <button className={buttonStyle} type="button" onClick={onSignInSubmit}>
        Sign In
      </button>

      <Link to="/app/register" className={buttonStyle}>
        Register
      </Link>
      <Link to="/app/landing" className={buttonStyle}>
        Back
      </Link>

      {busyElement}
      {stateElement}
    </div>
  );
};

export default AuthSignIn;
