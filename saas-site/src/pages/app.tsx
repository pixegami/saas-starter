import React from "react";
import { Router } from "@reach/router";
import Dashboard from "../app/dashboard";
import Landing from "../app/landing";
import NotFound from "../app/notFound";
import AuthRoute from "../components/auth/route/AuthRoute";
import * as AuthViews from "../components/auth/views/AuthViews";
import * as AuthURL from "../components/auth/route/AuthURL";
import ProfileView from "../app/ProfileView";

const App = () => {
  return (
    <Router>
      <AuthRoute component={Landing} path="/app" bypassAuth />
      <AuthRoute component={Dashboard} path="/app/dashboard" />
      <AuthRoute component={ProfileView} path="/app/profile" />
      <AuthRoute
        component={AuthViews.AuthRequestAccountVerification}
        path={AuthURL.VERIFY_ACCOUNT_REQUEST}
      />

      <AuthViews.AuthRegister path={AuthURL.REGISTER} />
      <AuthViews.AuthSignIn path={AuthURL.SIGN_IN} />
      <AuthViews.AuthForgotPassword path={AuthURL.FORGOT_PASSWORD} />
      <AuthViews.AuthResetPassword path={AuthURL.RESET_PASSWORD} />
      <AuthViews.AuthVerifyAccount path={AuthURL.VERIFY_ACCOUNT} />
      <Dashboard path="/app/dashboard2" />
      <NotFound default />
    </Router>
  );
};
export default App;
