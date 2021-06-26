import React from "react";
import AuthLocalApi from "./AuthLocalApi";
import { AuthState, AuthStateUtility } from "./AuthState";

export interface AuthContextProps {
  api: AuthLocalApi;
}

const createDefaultContextProps = () => {
  const authStateUtility: AuthStateUtility = new AuthStateUtility();
  const setAuthState = (x: AuthState) => console.log(x);
  const authApi: AuthLocalApi = new AuthLocalApi(
    authStateUtility,
    setAuthState
  );
  const context: AuthContextProps = {
    api: authApi,
  };

  return context;
};

const AuthContext = React.createContext<AuthContextProps>(
  createDefaultContextProps()
);

export default AuthContext;
