import { navigate } from "gatsby";
import { Link } from "gatsby";
import * as React from "react";
import AuthApi from "../../api/auth/AuthApi";

interface AuthWidgetProps {
  path: string;
}

const AuthWidget: React.FC<AuthWidgetProps> = (props) => {
  const onSignOut = () => {
    console.log("Sign out...");
    AuthApi.signOut();
    navigate("/app/dashboard");
  };

  const buttonStyle: string = "border m-1 p-1 border-black";

  return (
    <div>
      <div>Logged in with: {AuthApi.getSessionToken()}</div>
      <button className={buttonStyle} type="button" onClick={onSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default AuthWidget;
