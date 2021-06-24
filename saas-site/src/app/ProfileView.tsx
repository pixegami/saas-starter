import { loadStripe } from "@stripe/stripe-js";
import { Link, navigate } from "gatsby";
import * as React from "react";
import * as AuthURL from "../components/auth/route/AuthURL";
import AuthApi from "../api/auth/AuthApi";
import PaymentApi from "../api/payment/PaymentApi";
import withBoxStyling from "../components/hoc/withBoxStyling";

interface ProfileViewProps {
  path: string;
}

const ProfileView: React.FC<ProfileViewProps> = (props) => {
  const [isLoadingPremium, setLoadingPremium] = React.useState(true);
  const [isPremiumMember, setPremiumMember] = React.useState(false);

  const [isAutoRenew, setAutoRenew] = React.useState(false);
  const [expiryTime, setExpiryTime] = React.useState(0);

  const [
    isLoadingVerificationStatus,
    setLoadingVerificationStatus,
  ] = React.useState(true);
  const [isVerified, setVerified] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    AuthApi.getMembershipStatus().then((memberStatus) => {
      if (isMounted) {
        setPremiumMember(memberStatus.isMember);
        setAutoRenew(memberStatus.autoRenew);
        setExpiryTime(memberStatus.expiryTime);
        console.log("Set Autorenew to: " + memberStatus.autoRenew);
        setLoadingPremium(false);
      }
    });

    AuthApi.getVerificationStatusAsBoolean().then((isVerified) => {
      if (isMounted) {
        setVerified(isVerified);
        setLoadingVerificationStatus(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const onClickToSubscribe = () => {
    setLoadingPremium(true);
    PaymentApi.requestCheckoutAndRedirect().catch((r) => {
      setLoadingPremium(false);
      console.log(r);
    });
  };

  const onClickToPaymentPortal = () => {
    setLoadingPremium(true);
    PaymentApi.requestPaymentPortalAndRedirect();
  };

  let premiumStatusElement;
  let premiumInteractiveElement;

  if (isLoadingPremium) {
    premiumStatusElement = <div className="text-gray-400">Loading</div>;
    premiumInteractiveElement = <div className="loader-dark"></div>;
  } else {
    if (isPremiumMember) {
      premiumStatusElement = (
        <div>
          Active [Expiry: {expiryTime} | Renew: {isAutoRenew ? "ON" : "OFF"}]
        </div>
      );
      premiumInteractiveElement = (
        <button
          className="bg-blue-600 text-white rounded-md p-2 w-32"
          onClick={onClickToPaymentPortal}
        >
          Manage
        </button>
      );
    } else {
      premiumStatusElement = <div>Inactive</div>;
      premiumInteractiveElement = (
        <button
          className="bg-blue-600 text-white rounded-md p-2 w-32"
          onClick={onClickToSubscribe}
        >
          Subscribe
        </button>
      );
    }
  }

  const onClickToVerify = () => {
    setLoadingVerificationStatus(true);
    navigate(AuthURL.VERIFY_ACCOUNT_REQUEST);
  };

  let verificationStatusElement;
  let verificationInteractiveElement;

  if (isLoadingVerificationStatus) {
    verificationStatusElement = <div className="text-gray-400">Loading</div>;
    verificationInteractiveElement = <div className="loader-dark"></div>;
  } else {
    if (isVerified) {
      verificationStatusElement = (
        <div className="text-green-700">Verified</div>
      );
      verificationInteractiveElement = null;
    } else {
      verificationStatusElement = (
        <div className="text-red-700">Not Verified</div>
      );
      verificationInteractiveElement = (
        <button
          className="bg-blue-600 text-white rounded-md p-2 w-32"
          onClick={onClickToVerify}
        >
          Verify
        </button>
      );
    }
  }

  const premiumElement = (
    <div className="bg-gray-50 p-4 rounded-md flex justify-between mb-2">
      <div className="my-auto">
        <div className="text-gray-600 text-sm">Premium Status</div>
        <div className="text-lg font-light">{premiumStatusElement}</div>
      </div>

      <div className="my-auto">{premiumInteractiveElement}</div>
    </div>
  );

  const verifyElement = (
    <div className="bg-gray-50 p-4 rounded-md flex justify-between">
      <div className="my-auto">
        <div className="text-gray-600 text-sm">Verification Status</div>
        <div className="text-lg font-light">{verificationStatusElement}</div>
      </div>

      <div className="my-auto">{verificationInteractiveElement}</div>
    </div>
  );

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Your Profile</h1>
      {premiumElement}
      {verifyElement}
    </>
  );
};

export default withBoxStyling(ProfileView);
