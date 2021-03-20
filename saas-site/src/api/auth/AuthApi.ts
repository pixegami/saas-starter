import { stat } from "fs";
import BaseApi from "../BaseApi";
import AuthResponse from "./AuthResponse";
import AuthSession from "./AuthSession";

interface RequestObject {
  method: string;
  headers?: any;
  body?: string;
}

class AuthApi extends BaseApi {
  public static ENDPOINT: string = "https://api.ss.pixegami.com/auth";
  private static session: AuthSession | null = null;
  private static attemptedToLoadSession: boolean = false;

  private static setSession = (session: AuthSession) => {
    AuthApi.session = session;
    window.localStorage.setItem("cycloneSession", session.serialize());
    console.log(`Saved Session: ${session.serialize()}`);
  };

  public static getSession = () => {
    if (AuthApi.session === null && !AuthApi.attemptedToLoadSession) {
      AuthApi.attemptedToLoadSession = true;
      const sessionString = window.localStorage.getItem("cycloneSession");
      console.log(`Loading Session from Memory: ${sessionString}`);
      if (sessionString !== null && sessionString.length > 0) {
        AuthApi.session = AuthSession.parse(sessionString);
      }
    }
    return AuthApi.session;
  };

  public static clearSession = () => {
    AuthApi.session = null;
    window.localStorage.removeItem("cycloneSession");
  };

  public static isSignedIn = (): boolean => {
    if (AuthApi.getSession()) {
      if (AuthApi.getSession().token) {
        return true;
      }
    }
    return false;
  };

  private static invokePostApi = (
    operation: string,
    payload: object,
    onResponseReceived: (status: number, x: any) => void,
    onError: (x: any) => void
  ) => {
    console.log("Getting from API: " + AuthApi.ENDPOINT);
    const request = AuthApi.createRequest("POST", operation, payload);
    fetch(AuthApi.ENDPOINT, request)
      .then(async (rawResponse) =>
        onResponseReceived(rawResponse.status, await rawResponse.json())
      )
      .catch((error) => onError(error));
  };

  private static invokeGetApi = (
    operation: string,
    payload: object,
    onResponseReceived: (status: number, x: any) => void,
    onError: (x: any) => void
  ) => {
    console.log("Getting from API: " + AuthApi.ENDPOINT);
    const endpointWithParams: string =
      AuthApi.ENDPOINT +
      "?" +
      new URLSearchParams({ operation: operation, ...payload });
    const request = AuthApi.createRequest("GET", operation, payload);
    fetch(endpointWithParams, request)
      .then(async (rawResponse) =>
        onResponseReceived(rawResponse.status, await rawResponse.json())
      )
      .catch((error) => onError(error));
  };

  private static createRequest = (
    methodName: string,
    operation: string,
    payload: object
  ) => {
    const requestBody = { ...payload, flags: ["TMP"], operation };
    const request: RequestObject = {
      method: methodName,
      headers: {
        Authorization: "Bearer ",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (methodName !== "GET") {
      request.body = JSON.stringify(requestBody);
    }

    if (AuthApi.getSession() !== null) {
      const token = AuthApi.getSession()?.token;
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  };

  public static signIn() {
    console.log("Signing in!");
    return 200;
  }

  public static signIn2 = (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    console.log(`Signing In: ${email} : ${password}`);

    console.log(`Sign In: ${email} : ${password}`);
    const signInPayload = { user: email, password: password };

    var promise = new Promise<AuthResponse>((resolve, reject) => {
      const response: AuthResponse = {
        success: false,
        token: undefined,
        status: 400,
      };

      const onResolve = (status: number, x: any) => {
        response.token = x.token;
        response.success = status === 200;
        response.status = status;

        if (response.success) {
          const session = new AuthSession();
          session.token = x.token;
          session.email = "blah";
          console.log("Setting Token in Session...");
          AuthApi.setSession(session);
          resolve(response);
        } else {
          reject(`Got an error ${response.status}: ${x.message}`);
          console.log(x);
        }
      };

      AuthApi.invokePostApi("sign_in", signInPayload, onResolve, reject);
    });

    return promise;
  };

  public static register = (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    console.log(`Registering: ${email} : ${password}`);
    const signUpPayload = { user: email, password: password };

    var promise = new Promise<AuthResponse>((resolve, reject) => {
      const response: AuthResponse = {
        success: false,
        token: undefined,
        status: 400,
      };

      const onResolve = (status: number, x: any) => {
        response.token = x.token;
        response.success = true;
        response.status = status;
        resolve(response);
      };

      AuthApi.invokePostApi("sign_up", signUpPayload, onResolve, reject);
    });

    return promise;
  };

  public static validate = (): Promise<AuthResponse> => {
    console.log(`Validating...With Session ${AuthApi.getSession()}`);
    var promise = new Promise<AuthResponse>((resolve, reject) => {
      const response: AuthResponse = {
        success: false,
        token: undefined,
        status: 400,
      };

      const onResolve = (status: number, x: any) => {
        response.success = true;
        response.status = status;
        resolve(response);
        console.log(x.message);
      };

      AuthApi.invokeGetApi("validate_token", {}, onResolve, reject);
    });

    return promise;
  };

  public static signOut = (): Promise<string> => {
    const token: string = AuthApi.getSession().token;
    console.log(`Signing Out: ${token}`);
    AuthApi.clearSession();
    var promise = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        console.log("Signout complete!");
        resolve(`Sign out ${token}`);
      }, 1500);
    });
    return promise;
  };

  public static forgotPassword = (email: string): Promise<string> => {
    console.log(`Forgot password: ${email}`);
    var promise = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        console.log("Forgot password!");
        resolve(`Forgot password for ${email}`);
      }, 1500);
    });
    return promise;
  };
}

export default AuthApi;
