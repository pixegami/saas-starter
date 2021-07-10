import ApiResponse from "../../util/base_api/ApiResponse";
import AuthResponse from "./AuthResponse";
import AuthMembershipStatus from "./AuthMembershipStatus";
import BaseApi from "../../util/base_api/BaseApi";

class AuthApi extends BaseApi {
  // Configurable fields.
  private static ENDPOINT: string = "https://api.bonestack.com/auth";

  // private static AUTO_TEST: boolean = true;
  public static AUTO_TEST_USER: string = "autotest@auth.bonestack.com";
  public static AUTO_TEST_PASS: string = "Abcd123!";

  protected static getEndpoint(): string {
    return this.ENDPOINT;
  }

  public static signIn(email: string, password: string): Promise<AuthResponse> {
    const signInPromise = this.getRequest("sign_in", {
      email,
      password,
    });
    return this.withResponseTransformer(signInPromise);
  }

  public static signUp(
    email: string,
    password: string,
    withTestAccount: boolean = false,
    autoMember: boolean = false
  ): Promise<AuthResponse> {
    const operation = withTestAccount ? "sign_up_test_user" : "sign_up";
    const extraFlags = autoMember ? ["AUTO_MEMBER"] : [];

    const signUpPromise = this.postRequest(
      operation,
      {
        email,
        password,
      },
      undefined,
      extraFlags
    );

    return this.withResponseTransformer(signUpPromise);
  }

  public static requestAccountVerification(
    account_id: string
  ): Promise<AuthResponse> {
    return this.postRequest("request_account_verification", {
      account_id,
    });
  }

  public static requestAccountReset(email: string): Promise<AuthResponse> {
    return this.postRequest("request_account_reset", {
      email,
    });
  }

  public static resetAccount(
    reset_token: string,
    new_password: string
  ): Promise<AuthResponse> {
    return this.postRequest("reset_account", {
      reset_token,
      new_password,
    });
  }

  public static verifyAccount(
    verification_token: string
  ): Promise<AuthResponse> {
    return this.postRequest("verify_account", {
      verification_token,
    });
  }

  public static async verifyPremiumStatus(token: string): Promise<ApiResponse> {
    console.log("Validating premium status with " + token);
    return this.getRequest("verify_premium_status", {}, token);
  }

  public static async getAccountVerificationStatus(
    token: string
  ): Promise<ApiResponse> {
    console.log("Get verification status with " + token);
    return this.getRequest("get_verification_status", {}, token);
  }

  public static async getPremiumStatus(
    token: string
  ): Promise<AuthMembershipStatus> {
    const validationResponse = await AuthApi.verifyPremiumStatus(token);
    if (validationResponse.status === 200) {
      console.log("Validate Member Response:");
      console.log(validationResponse);
      return {
        isMember: true,
        autoRenew: validationResponse.payload["auto_renew"],
        expiryTime: validationResponse.payload["expiry_time"],
      };
    } else {
      return { isMember: false, autoRenew: false, expiryTime: 0 };
    }
  }

  public static async getAccountVerificationStatusAsBoolean(
    token: string
  ): Promise<boolean> {
    const validationResponse = await AuthApi.getAccountVerificationStatus(
      token
    );
    return (
      validationResponse.status === 200 &&
      validationResponse.payload["verified"]
    );
  }

  public static verifyToken(token: string): Promise<ApiResponse> {
    console.log(`Verifying Token: ...`);
    return this.getRequest("verify_token", {}, token);
  }

  private static withResponseTransformer(
    promise: Promise<ApiResponse>
  ): Promise<AuthResponse> {
    return new Promise<AuthResponse>((resolve, reject) => {
      promise
        .then((apiResponse) => {
          const authResponse = {
            ...apiResponse,
            token: apiResponse.payload.token,
          };
          resolve(authResponse);
        })
        .catch(reject);
    });
  }
}

export default AuthApi;
