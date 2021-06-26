import * as React from "react";
import AuthApi from "../api/AuthApi";
import AuthCommonComponent from "./AuthCommonComponent";
import * as AuthURL from "../route/AuthURL";
import {
  ApiButton,
  ApiStringField,
  ApiTextLink,
  withApiWrapper,
  SubComponentBaseProps,
} from "../../util/base_api_components/ApiComponents";
import { navigate } from "gatsby";
import AuthResponse from "../api/AuthResponse";

const AuthRegister: React.FC<SubComponentBaseProps> = (props) => {
  const emailField = ApiStringField.fromHook("Email", React.useState(""));
  const passwordField = ApiStringField.fromHook("Password", React.useState(""));

  const onRegisterSuccess = (result: AuthResponse) => {
    props.onApiResponse(result);
    if (result.status == 200) {
      console.log("Register succeeded");
      navigate(AuthURL.HOME);
    }
  };

  const onRegister = () => {
    console.log("Register with ", emailField.value, passwordField.value);
    props.onApiRequest();
    AuthApi.signUp(emailField.value, passwordField.value)
      .then(onRegisterSuccess)
      .catch(props.onApiFault);
  };

  const linkToSignIn = (
    <div className="mt-4">
      <ApiTextLink
        preLinkText="Already registered?"
        linkText="Sign in"
        linkPath={AuthURL.SIGN_IN}
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

export default withApiWrapper(AuthRegister);
