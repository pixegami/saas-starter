export interface AuthState {
  isBusy: boolean;
}

export const newDefaultAuthState = (): AuthState => {
  return {
    isBusy: false,
  };
};
