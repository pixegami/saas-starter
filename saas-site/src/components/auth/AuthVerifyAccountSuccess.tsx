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

const AuthVerifyAccountSuccess: React.FC<SubComponentBaseProps> = (props) => {
  const actionButton = (
    <ApiButton label="Sign In" onClick={() => navigate("/app/signIn")} />
  );

  return (
    <AuthCommonComponent header="Account Verified." apiState={props.apiState}>
      <div className="md:text-base text-sm text-gray-800 mb-6">
        <div className="font-semibold mb-2">
          Success! Your account has now been verified.{" "}
        </div>
        <div className="text-gray-600">
          Please sign in to start using your account.
        </div>
      </div>
      {actionButton}
    </AuthCommonComponent>
  );
};

export const WrappedAuthVerifyAccountSuccess = withApiWrapper(
  AuthVerifyAccountSuccess
);
