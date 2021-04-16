import * as React from "react";
import AuthCommonComponent from "./AuthCommonComponent";
import {
  ApiButton,
  withApiWrapper,
  SubComponentBaseProps,
} from "../../api/ApiComponents";
import * as AuthURL from "../route/AuthURL";
import { navigate } from "gatsby";

const AuthVerifyAccountSuccess: React.FC<SubComponentBaseProps> = (props) => {
  const actionButton = (
    <ApiButton label="Sign In" onClick={() => navigate(AuthURL.SIGN_IN)} />
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

export default withApiWrapper(AuthVerifyAccountSuccess);
