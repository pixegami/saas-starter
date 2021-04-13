import React from "react";
import { Router } from "@reach/router";
import AuthRouteLayout from "../components/AuthRouteLayout";
import Dashboard from "../app/dashboard";
import Landing from "../app/landing";
import NotFound from "../app/notFound";
import AuthRoute from "../app/util/AuthRoute";
import { WrappedAuthRegister } from "../components/auth/AuthRegister";
import { WrappedAuthSignIn } from "../components/auth/AuthSignIn";
import { WrappedApiSubComponent } from "../components/auth/ApiSubComponent";
import { WrappedAuthForgotPassword } from "../components/auth/AuthForgotPassword";
import { WrappedAuthResetPassword } from "../components/auth/AuthResetPassword";
import { WrappedAuthVerifyAccount } from "../components/auth/AuthVerifyAccount";

const App = () => (
  <Router>
    <AuthRoute component={Landing} path="/app" bypassAuth />
    <AuthRoute component={Dashboard} path="/app/dashboard" />
    <AuthRoute
      component={WrappedAuthVerifyAccount}
      path="/app/verify_account"
    />
    <WrappedApiSubComponent path="/app/sc" />
    <WrappedAuthRegister path="/app/register" />
    <WrappedAuthSignIn path="/app/signIn" />
    <WrappedAuthForgotPassword path="/app/recoverPassword" />
    <WrappedAuthResetPassword path="/app/resetPassword" />
    <NotFound default />
  </Router>
);
export default App;
