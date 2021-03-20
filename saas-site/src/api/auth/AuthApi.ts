import { AxiosResponse } from "axios";
import { stat } from "fs";
import ApiRequest from "../ApiRequest";
import ApiResponse from "../ApiResponse";
import BaseApi from "../BaseApi";
import AuthResponse from "./AuthResponse";
import AuthSession from "./AuthSession";

interface RequestObject {
  method: string;
  headers?: any;
  body?: string;
}

class AuthApi extends BaseApi {
  private static ENDPOINT: string = "https://api.ss.pixegami.com/auth";
  private static session: AuthSession | null = null;
  private static attemptedToLoadSession: boolean = false;
  private static token: string = "blah";

  protected static getEndpoint(): string {
    return this.ENDPOINT;
  }

  public static signIn(email: string, password: string): Promise<ApiResponse> {
    console.log("Signing in!");
    return this.withSideEffect(
      this.getRequest("sign_in", { user: email, password: password }),
      (x) => {
        this.token = x.payload.token;
        console.log(`Executing Side Effect: ${x.payload.token}`);
      }
    );
  }

  public static signUp(email: string, password: string): Promise<ApiResponse> {
    console.log(`Registering: ${email} : ${password}`);
    return this.postRequest("sign_up", { user: email, password: password });
  }

  public static validate(): Promise<ApiResponse> {
    console.log(`Validating With Token: ...`);
    return this.getRequest("validate_token", {}, this.token);
  }

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

  // public static validate = (): Promise<AuthResponse> => {
  //   console.log(`Validating...With Session ${AuthApi.getSession()}`);
  //   var promise = new Promise<AuthResponse>((resolve, reject) => {
  //     const response: AuthResponse = {
  //       success: false,
  //       token: undefined,
  //       status: 400,
  //     };

  //     const onResolve = (status: number, x: any) => {
  //       response.success = true;
  //       response.status = status;
  //       resolve(response);
  //       console.log(x.message);
  //     };

  //     AuthApi.invokeGetApi("validate_token", {}, onResolve, reject);
  //   });

  //   return promise;
  // };

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
