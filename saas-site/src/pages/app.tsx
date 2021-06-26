import React from "react";
import { Router } from "@reach/router";
import Landing from "../app/landing";
import NotFound from "../app/notFound";
import AuthRoute from "../components/auth/route/AuthRoute";
import * as AuthViews from "../components/auth/views/AuthViews";
import * as AuthURL from "../components/auth/route/AuthURL";
import ProfileView from "../app/ProfileView";
import AuthContext, {
  AuthApiContext,
} from "../components/auth/api/AuthContext";
import { AuthStateUtility } from "../components/auth/state/AuthState";

interface FullAuthProps {
  children?: React.ReactNode;
}

const FullAuth: React.FunctionComponent<FullAuthProps> = (props) => {
  const [authState, setAuthState] = React.useState(
    new AuthStateUtility().state
  );

  const authApiContext: AuthApiContext = new AuthApiContext(
    authState,
    setAuthState
  );

  console.log("Reloaded with new Auth State");
  console.log(authState);

  React.useEffect(() => {
    if (!authState.hasToken) {
      console.log("Loading state from browser.");
      const loadedAuthState = authApiContext.stateUtil.load();
      setAuthState({ ...loadedAuthState, firstLoad: false });
    }
  }, []);

  return (
    <AuthContext.Provider value={authApiContext}>
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
