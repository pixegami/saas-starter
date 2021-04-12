import * as React from "react";
import AuthApi from "../../api/auth/AuthApi";
import { SubComponentBaseProps, withApiWrapper } from "./ApiComponentWrapper";
import "../../styles/loader.css";
import AuthCommonComponent from "./AuthCommonComponent";
import ApiButton from "./ApiButton";
import ApiStringField from "./ApiStringField";
import ApiTextLink from "./ApiTextLink";
import ApiResponse from "../../api/ApiResponse";
import { navigate } from "gatsby";

const AuthResetPassword: React.FC<SubComponentBaseProps> = (props) => {
  const passwordField = ApiStringField.fromHook(
    "New Password",
    React.useState("")
  );

  const [passwordResetCompleted, setPasswordResetCompleted] = React.useState(
    false
  );

  const onSuccess = (response: ApiResponse) => {
    setPasswordResetCompleted(true);
    props.onApiResponse(response);
  };

  const onClick = () => {
    props.onApiRequest();
    AuthApi.delayedSuccess().then(onSuccess).catch(props.onApiFault);
  };

  const goToSignIn = () => {
    navigate("/app/signIn");
  };

  const passwordResetInstructions: string =
    "Please enter a new password for your account.";

  const isDisabled: boolean = props.apiState.isBusy || passwordResetCompleted;
  let interactiveElement = null;

  if (!passwordResetCompleted) {
    const resetPasswordButton = (
      <ApiButton
        label="Reset Password"
        onClick={onClick}
        isDisabled={isDisabled}
        isLoading={isDisabled}
      />
    );
    interactiveElement = (
      <div>
        {resetPasswordButton}
        <div className="mt-4">
          <ApiTextLink linkPath="/app/signIn" linkText="Back to Sign In" />
        </div>
      </div>
    );
  } else {
    const signInButton = (
      <ApiButton
        label="Back to Sign In"
        onClick={goToSignIn}
        isDisabled={false}
        isLoading={false}
      />
    );
    const successPrompt = (
      <div className="bg-green-50 border-green-300 border text-green-600 p-4 py-6 rounded-md mb-6">
        <div className="text-sm">
          Password has been reset. Please sign in to your account with the new
          password.
        </div>
      </div>
    );
    interactiveElement = (
      <div>
        {successPrompt}
        {signInButton}
      </div>
    );
  }

  return (
    <AuthCommonComponent
      header="Reset your password."
      apiState={props.apiState}
    >
      <div className="text-sm text-gray-500 mb-6">
        {passwordResetInstructions}
      </div>
      {passwordField.asComponent(isDisabled)}
      {interactiveElement}
    </AuthCommonComponent>
  );
};

export const WrappedAuthResetPassword = withApiWrapper(AuthResetPassword);
