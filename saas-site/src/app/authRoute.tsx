import React from "react";
import { navigate } from "gatsby";
import AuthApi from "../auth/api/AuthApi";
import AuthWidget from "../auth/components/AuthWidget";

const AuthRoute = ({ component: Component, path, ...rest }) => {
  console.log("In Auth Route: " + path);
  if (!AuthApi.isSignedIn() && path !== `/app/signIn`) {
    console.log("AUTH GUARD: DEFLECTED");
    navigate("/app/signIn");
    return null;
  }
  console.log("AUTH GUARD: PASSED");
  return (
    <div>
      <Component {...rest} />
      <AuthWidget path={path} />
    </div>
  );
};

export default AuthRoute;
