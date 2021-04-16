import React from "react";
import { navigate } from "gatsby";
import AuthApi from "../../../api/auth/AuthApi";
import AuthRouteLayout from "./AuthRouteLayout";
import * as AuthURL from "./AuthURL";

interface AuthRouteProps {
  component: any;
  path: string;
  bypassAuth?: boolean;
}

const RouteElement: React.FC<AuthRouteProps> = (props) => {
  return (
    <div>
      <AuthRouteLayout>
        <props.component {...props} />
      </AuthRouteLayout>
    </div>
  );
};

const AuthRoute: React.FC<AuthRouteProps> = (props) => {
  console.log("In Auth Route: " + props.path);

  // When bypassed, just render the element.
  if (props.bypassAuth) {
    return <RouteElement {...props} />;
  }

  // If signed in...
  if (AuthApi.isSignedIn()) {
    // If verified, then display the element.
    if (AuthApi.isAccountVerified()) {
      console.log("AUTH GUARD: PASSED");
      return <RouteElement {...props} />;
    }
    // If not verified, then re-route it.
    if (props.path == AuthURL.VERIFY_ACCOUNT) {
      return <RouteElement {...props} />;
    } else {
      console.log("AUTH GUARD: DEFLECTED");
      navigate(AuthURL.VERIFY_ACCOUNT);
      return null;
    }
  }

  console.log("AUTH GUARD: DEFLECTED");
  navigate(AuthURL.SIGN_IN);
  return null;
};

export default AuthRoute;
