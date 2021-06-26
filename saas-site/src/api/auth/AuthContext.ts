import React from "react";
import AuthLocalApi from "./AuthLocalApi";

export interface AuthContextState {
  hasToken: boolean;
  token?: string;
}

export const createDefaultAuthContext = (): AuthContextState => {
  return {
    hasToken: false,
  };
};

const SESSION_STORAGE_NAME: string = "ss_pixegami_auth_session";

export const loadLocalState = (): AuthContextState => {
  const isBrowser = typeof window !== "undefined";
  const sessionString = isBrowser
    ? window.localStorage.getItem(SESSION_STORAGE_NAME)
    : null;

  if (sessionString !== null && sessionString.length > 0) {
    // Parse the session.
    console.log(`Loading Session from Memory: ${sessionString}`);
    const jsonObject = JSON.parse(sessionString);
    return {
      hasToken: true,
      token: jsonObject.token,
    };
  } else {
    // Create a new empty session.
    console.log(`Creating new session.`);
    return createDefaultAuthContext();
  }
};

export interface AuthContextProps {
  authState: AuthContextState;
  setAuthState(x: AuthContextState): void;
  authApi: AuthLocalApi;
}

const createDefaultContextProps = () => {
  const authState: AuthContextState = createDefaultAuthContext();
  const setAuthState = (x: AuthContextState) => console.log(x);
  const authApi: AuthLocalApi = new AuthLocalApi(authState, setAuthState);
  return {
    authState,
    setAuthState,
    authApi,
  };
};

const AuthContext = React.createContext<AuthContextProps>(
  createDefaultContextProps()
);

export default AuthContext;
