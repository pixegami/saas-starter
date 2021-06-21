import { Link, navigate } from "gatsby";
import React, { useRef } from "react";
import AuthApi from "../../api/auth/AuthApi";
import * as AuthURL from "../auth/route/AuthURL";
import NavBarDropdown from "./NavBarDropdown";
import { NavMenuCommonProps } from "./NavBarInterfaces";
import NavBarPopupMenu from "./NavBarPopupMenu";
import NavMobileMenu from "./NavMobileMenu";

interface NavBarProps {}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } =
    typeof window !== "undefined"
      ? window
      : { innerWidth: 100, innerHeight: 100 };
  return {
    windowWidth: width,
    windowHeight: height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const siteTitle = <div className="my-auto">SaaS</div>;
  const isSignedIn = AuthApi.isSignedIn();
  const wrapperRef = useRef(null);
  let interactiveNavElement = null;
  let mobileNavElement = null;

  if (isSignedIn) {
    const navCommonProps = getNavBarCommonAttributes(wrapperRef);
    interactiveNavElement = <NavBarProfileElement {...navCommonProps} />;
    mobileNavElement = <NavMobileMenu {...navCommonProps} />;
  } else {
    interactiveNavElement = <NavBarSignInElement />;
  }

  return (
    <div className="mb-2 border-b border-gray-300">
      <div className="bg-white p-4 pt-4 pb-4 md:p-4 flex w-full">
        <div className="flex justify-between m-auto w-full max-w-4xl">
          {siteTitle}
          <div className="relative" ref={wrapperRef}>
            {interactiveNavElement}
          </div>
        </div>
      </div>
      {mobileNavElement}
    </div>
  );
};

const getNavBarCommonAttributes = (wrapperRef) => {
  const profileName = AuthApi.getSession().getUserEmail();
  const [isShowing, setIsShowing] = React.useState(false);
  const { windowWidth, windowHeight } = useWindowDimensions();
  const isMobileSize = windowWidth <= 640;
  const navCommonProps: NavMenuCommonProps = {
    isShowing,
    setIsShowing,
    wrapperRef,
    isMobile: isMobileSize,
    profileName: profileName,
    items: [
      { label: "Dashboard", action: () => navigate("/app/") },
      { label: "Profile", action: () => navigate("/app/profile") },
      {
        label: "Sign Out",
        action: () => {
          AuthApi.signOut();
          navigate("/app/dashboard");
        },
      },
    ],
  };
  return navCommonProps;
};

const NavBarProfileElement = (props: NavMenuCommonProps) => {
  return (
    <>
      <NavBarPopupMenu {...props} />
      <NavBarDropdown {...props} />
    </>
  );
};

const NavBarSignInElement = (props) => {
  return (
    <div className=" px-2 py-1 text-sm font-bold rounded-md border border-blue-500">
      <Link to={AuthURL.SIGN_IN} className="text-blue-600 hover:underline">
        Sign In
      </Link>
    </div>
  );
};

export default NavBar;
