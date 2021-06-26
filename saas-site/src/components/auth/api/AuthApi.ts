import ApiResponse from "../../util/base_api/ApiResponse";
import AuthResponse from "./AuthResponse";
import AuthMembershipStatus from "./AuthMembershipStatus";
import BaseApi from "../../util/base_api/BaseApi";

class AuthApi extends BaseApi {
  // Configurable fields.
  private static ENDPOINT: string = "https://api.bonestack.com/auth";

  // For testing easily.
  // private static AUTO_TEST: boolean = true;
  public static AUTO_TEST_USER: string = "autotest@auth.bonestack.com";
  public static AUTO_TEST_PASS: string = "Abcd123!";

  protected static getEndpoint(): string {
    return this.ENDPOINT;
  }

  public static signIn(email: string, password: string): Promise<AuthResponse> {
    console.log("Signing in!");
    const signInPromise = this.getRequest("sign_in", {
      user: email,
      password: password,
    });

    return this.withResponseTransformer(signInPromise);
  }

  public static signUp(
    email: string,
    password: string,
    withTestAccount: boolean = false,
    autoMember: boolean = false
  ): Promise<AuthResponse> {
    const operation = withTestAccount ? "create_test_account" : "sign_up";
    const extraFlags = autoMember ? ["AUTO_MEMBER"] : [];

    const signUpPromise = this.postRequest(
      operation,
      {
        user: email,
        password: password,
      },
      undefined,
      extraFlags
    );

    return this.withResponseTransformer(signUpPromise);
  }

  public static requestAccountVerification(
    account_key: string
  ): Promise<AuthResponse> {
    return this.postRequest("request_account_verification", {
      account_key,
    });
  }

  public static requestAccountReset(user: string): Promise<AuthResponse> {
    return this.postRequest("request_account_reset", {
      user,
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

  public static async validateMembership(token: string): Promise<ApiResponse> {
    console.log("Validating membership with " + token);
    return this.getRequest("validate_membership", {}, token);
  }

  public static async getVerificationStatus(
    token: string
  ): Promise<ApiResponse> {
    console.log("Get verification status with " + token);
    return this.getRequest("get_verification_status", {}, token);
  }

  public static async getMembershipStatus(
    token: string
  ): Promise<AuthMembershipStatus> {
    const validationResponse = await AuthApi.validateMembership(token);
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

  public static async getVerificationStatusAsBoolean(
    token: string
  ): Promise<boolean> {
    const validationResponse = await AuthApi.getVerificationStatus(token);
    return (
      validationResponse.status === 200 &&
      validationResponse.payload["verified"]
    );
  }

  public static validate(token: string): Promise<ApiResponse> {
    console.log(`Validating With Token: ...`);
    return this.getRequest("validate_token", {}, token);
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
