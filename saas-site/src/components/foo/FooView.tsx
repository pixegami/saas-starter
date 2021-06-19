import * as React from "react";
import withBoxStyling from "../hoc/withBoxStyling";
import AuthApi from "../../api/auth/AuthApi";
import FooApi from "../../api/foo/FooApi";

interface FooViewProps {}

interface ServiceResponseProps {
  fooIsSignedIn: boolean;
  fooIsIsVerified: boolean;
  fooIsPremium: boolean;
}

const ServiceResponseView = (props: ServiceResponseProps) => {
  const isSignedInStatus = props.fooIsSignedIn ? "✓" : "✖";
  const isVerifiedStatus = props.fooIsIsVerified ? "✓" : "✖";
  const isPremiumMember = props.fooIsPremium ? "✓" : "✖";
  const isSignedInColor = props.fooIsSignedIn
    ? "text-green-500"
    : "text-red-500";
  const isVerifiedColor = props.fooIsIsVerified
    ? "text-green-500"
    : "text-red-500";
  const isPremiumMColor = props.fooIsPremium
    ? "text-green-500"
    : "text-red-500";

  return (
    <div>
      <div className={isSignedInColor}>{isSignedInStatus} Signed In</div>
      <div className={isVerifiedColor}>{isVerifiedStatus} Verified</div>
      <div className={isPremiumMColor}>{isPremiumMember} Premium Plan</div>
    </div>
  );
};

const LoadingView = () => {
  const loaderElement = (
    <div className="w-7 h-7 flex">
      <div className="loader-dark" />
    </div>
  );
  return (
    <div className="flex flex-col">
      <div className="mx-auto">{loaderElement}</div>
    </div>
  );
};

const FooView: React.FC<FooViewProps> = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [fooIsSignedIn, setFooIsSignedIn] = React.useState(false);
  const [fooIsIsVerified, setFooIsVerified] = React.useState(false);
  const [fooIsPremium, setFooIsPremium] = React.useState(false);

  // Hit the Foo API and get the response.
  React.useEffect(() => {
    let isMounted: boolean = true;
    FooApi.foo()
      .then((r) => {
        if (isMounted) {
          setFooIsSignedIn(r.isSignedIn);
          setFooIsVerified(r.isVerified);
          setFooIsPremium(r.isPremium);
          setIsLoading(false);
        }
      })
      .catch((r) => {
        if (isMounted) {
          setFooIsSignedIn(false);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  let contentDisplay;

  if (isLoading) {
    contentDisplay = LoadingView();
  } else {
    contentDisplay = ServiceResponseView({
      fooIsSignedIn,
      fooIsIsVerified,
      fooIsPremium,
    });
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Foo Service Status</h1>
      <div className="bg-gray-50 rounded-md p-4 mt-2 mt-2 ">
        {contentDisplay}
      </div>
    </div>
  );
};

export default withBoxStyling(FooView);
