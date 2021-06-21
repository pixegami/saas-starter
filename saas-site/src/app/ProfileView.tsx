import { loadStripe } from "@stripe/stripe-js";
import { Link } from "gatsby";
import * as React from "react";
import AuthApi from "../api/auth/AuthApi";
import PaymentApi from "../api/payment/PaymentApi";
import FooView from "../components/foo/FooView";
import FooPostGallery from "../components/foo/posts/FooPostGallery";
import FooWritePostView from "../components/foo/posts/FooWritePostView";
import withBoxStyling from "../components/hoc/withBoxStyling";

interface ProfileViewProps {
  path: string;
}

const ProfileView: React.FC<ProfileViewProps> = (props) => {
  const [isLoadingPremium, setLoadingPremium] = React.useState(true);
  const [isPremiumMember, setPremiumMember] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    AuthApi.getMembershipStatus().then((isMember) => {
      if (isMounted) {
        setPremiumMember(isMember);
        setLoadingPremium(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const onClickToSubscribe = () => {
    setLoadingPremium(true);
    PaymentApi.requestCheckoutAndRedirect();
  };

  let premiumStatusElement;
  let premiumInteractiveElement;

  if (isLoadingPremium) {
    premiumStatusElement = <div className="text-gray-400">Loading</div>;
    premiumInteractiveElement = <div className="loader-dark"></div>;
  } else {
    const premiumStatusText: string = isPremiumMember ? "Active" : "Inactive";
    premiumStatusElement = <div>{premiumStatusText}</div>;
    premiumInteractiveElement = (
      <button
        className="bg-blue-600 text-white rounded-md p-2 w-32"
        onClick={onClickToSubscribe}
      >
        Subscribe
      </button>
    );
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
        <div className="text-lg font-light">Unverified</div>
      </div>

      <div className="my-auto">
        <button className="bg-blue-600 text-white rounded-md p-2 w-32">
          Verify
        </button>
      </div>
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
