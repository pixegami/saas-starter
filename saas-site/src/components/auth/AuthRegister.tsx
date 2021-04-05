import * as React from "react";
import AuthApi from "../../api/auth/AuthApi";
import { SubComponentBaseProps, withApiWrapper } from "./ApiComponentWrapper";
import "../../styles/loader.css";
import AuthCommonComponent from "./AuthCommonComponent";
import ApiButton from "./ApiButton";
import ApiStringField from "./ApiStringField";
import ApiTextLink from "./ApiTextLink";

const AuthRegister: React.FC<SubComponentBaseProps> = (props) => {
  const emailField = ApiStringField.fromHook("Email", React.useState(""));
  const passwordField = ApiStringField.fromHook("Password", React.useState(""));

  const onRegister = () => {
    console.log("Register with ", emailField.value, passwordField.value);
    props.onApiRequest();
    AuthApi.delayedError().then(props.onApiResponse).catch(props.onApiFault);
  };

  const linkToSignIn = (
    <div className="mt-2">
      <ApiTextLink
        preLinkText="Already registered?"
        linkText="Sign in"
        linkPath="/app/signIn"
      />
    </div>
  );

  const isDisabled: boolean = props.apiState.isBusy;

  return (
    <AuthCommonComponent
      header="Create a new account."
      apiState={props.apiState}
    >
      {emailField.asComponent(isDisabled)}
      {passwordField.asComponent(isDisabled)}
      <ApiButton
        label="Register"
        onClick={onRegister}
        isDisabled={isDisabled}
        isLoading={isDisabled}
      />
      {linkToSignIn}
    </AuthCommonComponent>
  );
};

export const WrappedAuthRegister = withApiWrapper(AuthRegister);
