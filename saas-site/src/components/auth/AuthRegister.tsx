import * as React from "react";
import AuthApi from "../../api/auth/AuthApi";
import { SubComponentBaseProps, withApiWrapper } from "./ApiComponentWrapper";
import "../../styles/loader.css";
import AuthCommonComponent from "./AuthCommonComponent";
import ApiButton from "./ApiButton";
import { Link } from "gatsby";
import ApiStringField from "./ApiStringField";

const AuthRegister: React.FC<SubComponentBaseProps> = (props) => {
  const emailField = ApiStringField.fromHook("Email", React.useState(""));
  const passwordField = ApiStringField.fromHook("Password", React.useState(""));

  const onCustomFault = (x: any) => {
    console.log("Custom Fault Detected!");
    props.onApiFault(x);
  };

  const onRegister = () => {
    console.log("Register with ", emailField.value, passwordField.value);
    props.onApiRequest();
    AuthApi.delayedError().then(props.onApiResponse).catch(onCustomFault);
  };

  const createAccountLink = (
    <div className="mt-2 text-gray-600 text-center text-sm">
      Already registered?
      <Link to="/app/signIn" className="ml-1 text-blue-600 hover:underline">
        Sign in
      </Link>
    </div>
  );

  const isDisabled: boolean = props.apiState.isBusy;

  return (
    <AuthCommonComponent apiState={props.apiState}>
      {emailField.asComponent(isDisabled)}
      {passwordField.asComponent(isDisabled)}
      <ApiButton
        label="Register"
        onClick={onRegister}
        isDisabled={isDisabled}
        isLoading={isDisabled}
      />
      {createAccountLink}
    </AuthCommonComponent>
  );
};

export const WrappedAuthRegister = withApiWrapper(AuthRegister);
