import React, { Component } from "react";
import { navigate } from "gatsby";
import AuthApi from "../../api/auth/AuthApi";
import AuthRouteLayout from "../../components/AuthRouteLayout";

interface AuthRouteProps {
  component: any;
  path: string;
  bypassAuth?: boolean;
}

const VERIFY_ACCOUNT_URL: string = "/app/verify_account";
const SIGN_IN_URL: string = "/app/signIn";

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
    if (props.path == VERIFY_ACCOUNT_URL) {
      return <RouteElement {...props} />;
    } else {
      console.log("AUTH GUARD: DEFLECTED");
      navigate(VERIFY_ACCOUNT_URL);
      return null;
    }
  }

  console.log("AUTH GUARD: DEFLECTED");
  navigate(SIGN_IN_URL);
  return null;
};

export default AuthRoute;
