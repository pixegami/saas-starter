import ApiResponse from "../base/ApiResponse";

interface FooResponse extends ApiResponse {
  isPremium?: boolean;
  isVerified?: boolean;
  isSignedIn?: boolean;
}

export const withFooResponse = (
  promise: Promise<ApiResponse>
): Promise<FooResponse> => {
  return new Promise<FooResponse>((resolve, reject) => {
    promise
      .then((apiResponse) => {
        const authResponse = {
          ...apiResponse,
          isPremium: apiResponse.payload["is_member"],
          isVerified: apiResponse.payload["is_verified"],
          isSignedIn: apiResponse.payload["is_signed_in"],
        };
        resolve(authResponse);
      })
      .catch(reject);
  });
};

export default FooResponse;
