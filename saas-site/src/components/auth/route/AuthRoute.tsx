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

  // Is signed in.
  if (AuthApi.isSignedIn()) {
    console.log("AUTH GUARD: PASSED");
    return <RouteElement {...props} />;
  }

  console.log("AUTH GUARD: DEFLECTED");
  navigate(AuthURL.SIGN_IN);
  return null;
};

export default AuthRoute;
