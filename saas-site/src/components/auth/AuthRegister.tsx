import { Link } from "gatsby";
import * as React from "react";
import { ReactNode } from "react";
import AuthApi from "../../api/auth/AuthApi";
import AuthResponse from "../../api/auth/AuthResponse";
import { SubComponentBaseProps, withApiWrapper } from "./ApiComponentWrapper";
import { ApiState } from "./ApiState";

const createInputField = (
  defaultValue: string,
  setValue: (x: string) => void,
  isDisabled: boolean
) => {
  return (
    <input
      className="border m-1 p-1 border-black"
      type="text"
      defaultValue={defaultValue}
      onChange={(e) => setValue(e.currentTarget.value)}
      disabled={isDisabled}
    />
  );
};

const createButton = (label: string, onClick: any, isDisabled: boolean) => {
  return (
    <button
      className="border m-1 p-1 border-black"
      type="button"
      onClick={onClick}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};

// Split the common form logic.

// Split out the styling.

const AuthCommonComponent: React.FC<{ apiState: ApiState }> = (props) => {
  const busyElement = props.apiState.isBusy ? <div>Loading...</div> : null;
  const errorElement = props.apiState.hasError ? (
    <div className="text-red-500">Error: {props.apiState.errorMessage}</div>
  ) : null;

  return (
    <>
      <div className="text-lg">
        <h1>This is the Auth Register Page.</h1>
        {props.children}
        {busyElement}
        {errorElement}
        <Link to="/app/landing">Back</Link>
      </div>
    </>
  );
};

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

  return (
    <AuthCommonComponent apiState={props.apiState}>
      {createInputField(email, setEmail, props.apiState.isBusy)}
      {createInputField(password, setPassword, props.apiState.isBusy)}
      {createButton("Register", onRegister, props.apiState.isBusy)}
    </AuthCommonComponent>
  );
};

export const WrappedAuthRegister = withApiWrapper(AuthRegister);
