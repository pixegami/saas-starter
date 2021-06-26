import React from "react";
import { Router } from "@reach/router";
import Landing from "../app/landing";
import NotFound from "../app/notFound";
import AuthRoute from "../components/auth/route/AuthRoute";
import * as AuthViews from "../components/auth/views/AuthViews";
import * as AuthURL from "../components/auth/route/AuthURL";
import ProfileView from "../app/ProfileView";
import AuthContext, { AuthContextProps } from "../api/auth/AuthContext";
import AuthLocalApi from "../api/auth/AuthLocalApi";
import { AuthStateUtility } from "../api/auth/AuthState";

interface FullAuthProps {
  children?: React.ReactNode;
}

const FullAuth: React.FunctionComponent<FullAuthProps> = (props) => {
  const authStateUtil: AuthStateUtility = new AuthStateUtility();
  const [authState, setAuthState] = React.useState(authStateUtil.state);
  const authApi: AuthLocalApi = new AuthLocalApi(authStateUtil, setAuthState);

  console.log("Reloaded with new Auth State");
  console.log(authState);

  React.useEffect(() => {
    const loadedAuthState = authStateUtil.state;
    setAuthState(loadedAuthState);
  }, []);

  const authContextProps: AuthContextProps = {
    authStateUtility: authStateUtil,
    authState: authState,
    setAuthState: setAuthState,
    authApi,
  };

  return (
    <AuthContext.Provider value={authContextProps}>
      <Router>
        <AuthRoute
          component={AuthViews.AuthRequestAccountVerification}
          path={AuthURL.VERIFY_ACCOUNT_REQUEST}
        />

        <AuthViews.AuthRegister path={AuthURL.REGISTER} />
        <AuthViews.AuthSignIn path={AuthURL.SIGN_IN} />
        <AuthViews.AuthForgotPassword path={AuthURL.FORGOT_PASSWORD} />
        <AuthViews.AuthResetPassword path={AuthURL.RESET_PASSWORD} />
        <AuthViews.AuthVerifyAccount path={AuthURL.VERIFY_ACCOUNT} />

        {props.children}
      </Router>
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <FullAuth>
      <AuthRoute component={Landing} path="/app" bypassAuth />
      {/* <AuthRoute component={Dashboard} path="/app/dashboard" /> */}
      <AuthRoute component={ProfileView} path="/app/profile" />
      {/* <Dashboard path="/app/dashboard2" /> */}
      <NotFound default />
    </FullAuth>
  );
};
export default App;
