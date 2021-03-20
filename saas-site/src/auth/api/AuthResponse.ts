interface AuthResponse {
  success: boolean;
  status: number;
  errorDetails?: string;
  token?: string;
}

export default AuthResponse;
