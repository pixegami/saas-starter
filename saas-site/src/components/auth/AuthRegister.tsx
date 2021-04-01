import { Link } from "gatsby";
import * as React from "react";
import AuthApi from "../../api/auth/AuthApi";
import AuthResponse from "../../api/auth/AuthResponse";
import { newDefaultAuthState } from "./AuthState";

interface AuthRegisterProps {
  path: string;
}

const AuthRegister: React.FC<AuthRegisterProps> = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authState, setAuthState] = React.useState(newDefaultAuthState());

  const onRegisterSuccess = (response: AuthResponse) => {
    setAuthState({ ...authState, isBusy: false });
    console.log("Register success!");
    console.log("Token: ", response.token);
  };

  const onRegisterError = (x: any) => {
    setAuthState({ ...authState, isBusy: false });
    console.log("Failed to register");
    console.log(x);
  };

  const onRegister = () => {
    console.log("Register with ", email, password);
    setAuthState({ ...authState, isBusy: true });
    AuthApi.delayedSuccess().then(onRegisterSuccess).catch(onRegisterError);
  };

  const busyElement = authState.isBusy ? <div>Loading...</div> : null;

  return (
    <div className="text-lg">
      <h1>This is the Auth Register Page.</h1>

      <input
        className="border m-1 p-1 border-black"
        type="text"
        defaultValue={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <input
        className="border m-1 p-1 border-black"
        type="password"
        defaultValue={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <button
        className="border m-1 p-1 border-black"
        type="button"
        onClick={onRegister}
        disabled={authState.isBusy}
      >
        Register
      </button>

      {busyElement}

      <Link to="/app/landing">Back</Link>
    </div>
  );
};

export default AuthRegister;
