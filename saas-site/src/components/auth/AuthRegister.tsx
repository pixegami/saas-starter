import { Link } from "gatsby";
import * as React from "react";
import AuthApi from "../../api/auth/AuthApi";
import AuthResponse from "../../api/auth/AuthResponse";
import { SubComponentBaseProps, withApiWrapper } from "./ApiComponentWrapper";

const AuthRegister: React.FC<SubComponentBaseProps> = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onCustomFault = (x: any) => {
    console.log("Custom Fault Detected!");
    props.onApiFault(x);
  };

  const onRegister = () => {
    console.log("Register with ", email, password);
    props.onApiRequest();
    AuthApi.delayedError().then(props.onApiResponse).catch(onCustomFault);
  };

  const busyElement = props.apiState.isBusy ? <div>Loading...</div> : null;
  const errorElement = props.apiState.hasError ? (
    <div className="text-red-500">Error: {props.apiState.errorMessage}</div>
  ) : null;

  return (
    <div className="text-lg">
      <h1>This is the Auth Register Page.</h1>

      <input
        className="border m-1 p-1 border-black"
        type="text"
        defaultValue={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        disabled={props.apiState.isBusy}
      />
      <input
        className="border m-1 p-1 border-black"
        type="password"
        defaultValue={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        disabled={props.apiState.isBusy}
      />
      <button
        className="border m-1 p-1 border-black"
        type="button"
        onClick={onRegister}
        disabled={props.apiState.isBusy}
      >
        Register
      </button>

      {busyElement}
      {errorElement}

      <Link to="/app/landing">Back</Link>
    </div>
  );
};

export const WrappedAuthRegister = withApiWrapper(AuthRegister);
