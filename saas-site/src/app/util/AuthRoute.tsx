import React from "react";
import { navigate } from "gatsby";
import AuthApi from "../../api/auth/AuthApi";

const AuthRoute = ({ component: Component, path, ...rest }) => {
  console.log("In Auth Route: " + path);
  if (!AuthApi.hasSessionToken() && path !== `/app/signIn`) {
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
