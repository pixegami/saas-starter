import * as React from "react";
import withBoxStyling from "../hoc/withBoxStyling";
import AuthApi from "../../api/auth/AuthApi";

interface FooViewProps {}

const FooView: React.FC<FooViewProps> = (props) => {
  const isSignedInStatus = AuthApi.isSignedIn() ? "✓" : "✖";
  const isVerifiedStatus = AuthApi.isAccountVerified() ? "✓" : "✖";
  const isPremiumMember = AuthApi.isAccountVerified() ? "✓" : "✖";

  const isSignedInColor = AuthApi.isSignedIn()
    ? "text-green-500"
    : "text-red-500";
  const isVerifiedColor = AuthApi.isAccountVerified()
    ? "text-green-500"
    : "text-red-500";
  const isPremiumMColor = AuthApi.isAccountVerified()
    ? "text-green-500"
    : "text-red-500";

  return (
    <div>
      <h1 className="text-xl font-bold">Foo Service Status</h1>
      <div className="rounded-md p-4 mt-2">
        <div className={isSignedInColor}>{isSignedInStatus} Signed In</div>
        <div className={isVerifiedColor}>{isVerifiedStatus} Verified</div>
        <div className={isPremiumMColor}>{isPremiumMember} Premium Plan</div>
      </div>
    </div>
  );
};

export default withBoxStyling(FooView);
