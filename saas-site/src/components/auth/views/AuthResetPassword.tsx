import * as React from "react";
import AuthApi from "../../../api/auth/AuthApi";
import AuthCommonComponent from "./AuthCommonComponent";
import * as AuthURL from "../route/AuthURL";
import {
  ApiButton,
  ApiStringField,
  ApiTextLink,
  withApiWrapper,
  SubComponentBaseProps,
} from "../../api/ApiComponents";
import { navigate } from "gatsby";
import ApiResponse from "../../../api/base/ApiResponse";

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
    navigate(AuthURL.SIGN_IN);
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
          <ApiTextLink linkPath={AuthURL.SIGN_IN} linkText="Back to Sign In" />
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

export default withApiWrapper(AuthResetPassword);
