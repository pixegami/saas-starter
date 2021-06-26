interface AuthMembershipStatus {
  isMember: boolean;
  expiryTime: number;
  autoRenew: boolean;
}

export default AuthMembershipStatus;
