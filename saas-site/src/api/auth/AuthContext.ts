import React from "react";
import AuthLocalApi from "./AuthLocalApi";
import { AuthState, AuthStateUtility } from "./AuthState";

export interface AuthContextProps {
  authState: AuthState;
  setAuthState(x: AuthState): void;
  authApi: AuthLocalApi;
  authStateUtility: AuthStateUtility;
}

const createDefaultContextProps = () => {
  const authStateUtility: AuthStateUtility = new AuthStateUtility();
  const setAuthState = (x: AuthState) => console.log(x);
  const authApi: AuthLocalApi = new AuthLocalApi(
    authStateUtility,
    setAuthState
  );
  return {
    authStateUtility,
    authState: authStateUtility.state,
    setAuthState,
    authApi,
  };
};

const AuthContext = React.createContext<AuthContextProps>(
  createDefaultContextProps()
);

export default AuthContext;
