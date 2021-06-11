import { navigate } from "gatsby";
import React, { useRef } from "react";
import AuthApi from "../../api/auth/AuthApi";
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
  const profileName = AuthApi.getSession().getUserEmail();
  const [isShowing, setIsShowing] = React.useState(false);
  const { windowWidth, windowHeight } = useWindowDimensions();
  const wrapperRef = useRef(null);

  const isMobileSize = windowWidth <= 640;

  const navCommonProps: NavMenuCommonProps = {
    isShowing,
    setIsShowing,
    wrapperRef,
    isMobile: isMobileSize,
    profileName: profileName,
    items: [
      { label: "Profile", action: console.log },
      { label: "Settings", action: console.log },
      {
        label: "Sign Out",
        action: () => {
          console.log("sign out click");
          AuthApi.signOut();
          navigate("/app/dashboard");
        },
      },
    ],
  };

  return (
    <div className="mb-2 border-b border-gray-300">
      <div className="bg-white p-4 pt-4 pb-4 md:p-4 flex w-full">
        <div className="flex justify-between m-auto w-full max-w-4xl">
          {siteTitle}
          <div className="relative" ref={wrapperRef}>
            <NavBarPopupMenu {...navCommonProps} />
            <NavBarDropdown {...navCommonProps} />
          </div>
        </div>
      </div>
      <NavMobileMenu {...navCommonProps} />
    </div>
  );
};

export default NavBar;
