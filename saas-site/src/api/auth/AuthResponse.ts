import ApiResponse from "../ApiResponse";

interface AuthResponse extends ApiResponse {
  token?: string;
}

export default AuthResponse;
