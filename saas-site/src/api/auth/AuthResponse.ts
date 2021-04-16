import ApiResponse from "../base/ApiResponse";

interface AuthResponse extends ApiResponse {
  token?: string;
}

export default AuthResponse;
