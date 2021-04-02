import { Link } from "gatsby";
import * as React from "react";
import AuthApi from "../../api/auth/AuthApi";
import AuthResponse from "../../api/auth/AuthResponse";
import { ApiStateOverride, newApiState } from "./ApiState";

interface AuthRegisterProps {
  path: string;
}

const AuthRegister: React.FC<AuthRegisterProps> = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [authState, setAuthState] = React.useState(newApiState());
  const setAuthStateWithOverride = (override: ApiStateOverride) => {
    setAuthState(newApiState(override));
  };

  const onApiResponse = (response: AuthResponse) => {
    console.log("Register response received!");
    console.log("Response: ", response);

    if (response.status == 200) {
      setAuthStateWithOverride({ isBusy: false });
    } else {
      setAuthStateWithOverride({
        hasError: true,
        errorMessage: response.message,
      });
    }
  };

  const onApiFault = (x: any) => {
    setAuthStateWithOverride({
      hasError: true,
      errorMessage: `Something unexpected happened! [${x}]`,
    });
  };

  const onRegister = () => {
    console.log("Register with ", email, password);
    setAuthStateWithOverride({ isBusy: true });
    AuthApi.delayedFault().then(onApiResponse).catch(onApiFault);
  };

  const busyElement = authState.isBusy ? <div>Loading...</div> : null;
  const errorElement = authState.hasError ? (
    <div className="text-red-500">Error: {authState.errorMessage}</div>
  ) : null;

  return (
    <div className="text-lg">
      <h1>This is the Auth Register Page.</h1>

      <input
        className="border m-1 p-1 border-black"
        type="text"
        defaultValue={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        disabled={authState.isBusy}
      />
      <input
        className="border m-1 p-1 border-black"
        type="password"
        defaultValue={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        disabled={authState.isBusy}
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
      {errorElement}

      <Link to="/app/landing">Back</Link>
    </div>
  );
};

export default AuthRegister;
