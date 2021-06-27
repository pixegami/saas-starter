import React from "react";
import AuthContext, { AuthApiContext } from "../api/AuthContext";
import { AuthStateUtility } from "../state/AuthState";

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthProvider: React.FunctionComponent<AuthProviderProps> = (props) => {
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
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
