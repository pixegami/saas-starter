import React, { Component } from "react";
import { navigate } from "gatsby";
import AuthApi from "../../api/auth/AuthApi";
import AuthRouteLayout from "../../components/AuthRouteLayout";

interface AuthRouteProps {
  component: any;
  path: string;
  bypassAuth?: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = (props) => {
  console.log("In Auth Route: " + props.path);

  if (!props.bypassAuth) {
    if (!AuthApi.hasSessionToken() && props.path !== `/app/signIn`) {
      console.log("AUTH GUARD: DEFLECTED");
      navigate("/app/signIn");
      return null;
    }
  }
  console.log("AUTH GUARD: PASSED");
  return (
    <div>
      <AuthRouteLayout>
        <props.component {...props} />
      </AuthRouteLayout>
    </div>
  );
};

export default AuthRoute;
