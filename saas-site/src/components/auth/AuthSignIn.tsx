import { navigate } from "gatsby";
import * as React from "react";
import AuthApi from "../../api/auth/AuthApi";
import AuthResponse from "../../api/auth/AuthResponse";
import ApiButton from "./ApiButton";
import { SubComponentBaseProps, withApiWrapper } from "./ApiComponentWrapper";
import ApiStringField from "./ApiStringField";
import ApiTextLink from "./ApiTextLink";
import AuthCommonComponent from "./AuthCommonComponent";

const AuthSignIn: React.FC<SubComponentBaseProps> = (props) => {
  const emailField = ApiStringField.fromHook("Email", React.useState(""));
  const passwordField = ApiStringField.fromHook("Password", React.useState(""));
  // navigate("/app/dashboard");

  const onSignInSuccess = (result: AuthResponse) => {
    props.onApiResponse(result);
    console.log("Sign In succeeded");
    navigate("/app/dashboard");
  };

  const onSignIn = () => {
    console.log("Sign in with ", emailField.value, passwordField.value);
    props.onApiRequest();
    AuthApi.fakeSignIn(emailField.value, passwordField.value)
      .then(onSignInSuccess)
      .catch(props.onApiFault);
  };

  const isDisabled: boolean = props.apiState.isBusy;

  const linkToRegister = (
    <div className="mt-2">
      <ApiTextLink
        isDisabled={isDisabled}
        preLinkText="Need an account?"
        linkText="Register"
        linkPath="/app/register"
      />
    </div>
  );

  const linkToRecoverPassword = (
    <div className="-mt-4 mb-8">
      <ApiTextLink
        isDisabled={isDisabled}
        justifyStyle="justify-end"
        linkText="Forgot password?"
        linkPath="/app/recoverPassword"
      />
    </div>
  );

  return (
    <AuthCommonComponent header="Sign in." apiState={props.apiState}>
      {emailField.asComponent(isDisabled)}
      {passwordField.asComponent(isDisabled)}
      {linkToRecoverPassword}
      <ApiButton
        label="Sign In"
        onClick={onSignIn}
        isDisabled={isDisabled}
        isLoading={isDisabled}
      />
      {linkToRegister}
    </AuthCommonComponent>
  );
};

export const WrappedAuthSignIn = withApiWrapper(AuthSignIn);
