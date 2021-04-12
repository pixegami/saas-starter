import * as React from "react";
import AuthApi from "../../api/auth/AuthApi";
import { SubComponentBaseProps, withApiWrapper } from "./ApiComponentWrapper";
import "../../styles/loader.css";
import AuthCommonComponent from "./AuthCommonComponent";
import ApiButton from "./ApiButton";
import ApiStringField from "./ApiStringField";
import ApiTextLink from "./ApiTextLink";
import ApiResponse from "../../api/ApiResponse";

const AuthForgotPassword: React.FC<SubComponentBaseProps> = (props) => {
  const emailField = ApiStringField.fromHook("Email", React.useState(""));
  const [recoveryEmailSent, setRecoveryEmailSent] = React.useState(false);

  const onSuccess = (response: ApiResponse) => {
    setRecoveryEmailSent(true);
    props.onApiResponse(response);
  };

  const onClick = () => {
    props.onApiRequest();
    AuthApi.delayedSuccess().then(onSuccess).catch(props.onApiFault);
  };

  const isDisabled: boolean = props.apiState.isBusy || recoveryEmailSent;
  const instructions: string =
    "Enter your email and we'll send you instructions to recover your account.";

  let interactionElement = null;

  if (recoveryEmailSent) {
    interactionElement = (
      <div className="bg-green-50 border-green-300 border text-green-600 p-4 rounded-md">
        <div className="font-bold">Success!</div>{" "}
        <div className="text-sm">
          Please check your email for further instructions.
        </div>
      </div>
    );
  } else {
    interactionElement = (
      <ApiButton
        label="Send Recovery Link"
        onClick={onClick}
        isDisabled={isDisabled}
        isLoading={isDisabled}
      />
    );
  }

  return (
    <AuthCommonComponent
      header="Recover your account."
      apiState={props.apiState}
    >
      <div className="text-sm text-gray-500 mb-6">{instructions}</div>
      {emailField.asComponent(isDisabled)}
      {interactionElement}

      <div className="mt-4">
        <ApiTextLink linkPath="/app/signIn" linkText="Back" />
      </div>
    </AuthCommonComponent>
  );
};

export const WrappedAuthForgotPassword = withApiWrapper(AuthForgotPassword);
