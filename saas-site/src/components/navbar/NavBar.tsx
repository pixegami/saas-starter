import React, { useRef } from "react";
import AuthApi from "../../api/auth/AuthApi";

interface NavBarProps {}

interface NavMenuCommonProps {
  isMobile?: boolean;
  isShowing?: boolean;
  setIsShowing?: (x: boolean) => void;
  wrapperRef?: any;
}

const NavMobileMenu: React.FC<NavMenuCommonProps> = (props) => {
  if (!props.isMobile || !props.isShowing) {
    return null;
  }

  return (
    <div>
      <a
        href="#"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        role="menuitem"
      >
        Your Profile
      </a>
      <a
        href="#"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        role="menuitem"
      >
        Your Profile
      </a>
      <a
        href="#"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        role="menuitem"
      >
        Your Profile
      </a>
    </div>
  );
};

const NavBarPopupMenu: React.FC<NavMenuCommonProps> = (props) => {
  const onClick = (e: any) => {
    console.log("CLICKED BUTTON!");
    props.setIsShowing(!props.isShowing);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="w-8 h-8 bg-yellow-300 rounded-full"
        onClick={onClick}
      ></button>
    </div>
  );
};

const DropDownMenu: React.FC<NavMenuCommonProps> = (props) => {
  if (!props.isShowing || props.isMobile) {
    return null;
  }

  React.useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        props.wrapperRef.current &&
        !props.wrapperRef.current.contains(event.target) &&
        !props.isMobile
      ) {
        props.setIsShowing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props.wrapperRef]);

  return (
    <div className="origin-top-right absolute right-0 top-12 w-60 p-2 rounded-md bg-white border border-black border-opacity-10 focus:outline-none">
      <a
        href="#"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        role="menuitem"
      >
        Your Profile
      </a>

      <a
        href="#"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        role="menuitem"
      >
        Settings
      </a>

      <a
        href="#"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        role="menuitem"
      >
        Sign out
      </a>
    </div>
  );
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
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
  const siteTitle = <div className="my-auto">Saas Starter</div>;
  const profile = <div className="my-auto">Profile</div>;
  const token = <div className="my-auto">{AuthApi.getSessionToken()}</div>;
  const [isShowing, setIsShowing] = React.useState(false);
  const { windowWidth, windowHeight } = useWindowDimensions();
  const wrapperRef = useRef(null);

  const isMobileSize = windowWidth <= 640;

  const navCommonProps: NavMenuCommonProps = {
    isShowing,
    setIsShowing,
    wrapperRef,
    isMobile: isMobileSize,
  };

  return (
    <div className="bg-gray-400 p-2 pt-4 pb-4 md:p-4 mb-2 flex">
      <div className="m-auto w-full max-w-6xl">
        <div className="flex border border-red-500 justify-between">
          {siteTitle}
          {profile}
          {token}
          <div className="relative" ref={wrapperRef}>
            <NavBarPopupMenu {...navCommonProps} />
            <DropDownMenu {...navCommonProps} />
          </div>
        </div>
        <NavMobileMenu {...navCommonProps} />
      </div>
    </div>
  );
};

export default NavBar;
