import { navigate } from "gatsby";
import { Link } from "gatsby";
import React, { useRef } from "react";
import AuthApi from "../../api/auth/AuthApi";

interface NavBarProps {}

interface NavMenuCommonProps {
  isMobile?: boolean;
  isShowing?: boolean;
  setIsShowing?: (x: boolean) => void;
  wrapperRef?: any;
  items: NavMenuItem[];
}

const NavMobileMenu: React.FC<NavMenuCommonProps> = (props) => {
  if (!props.isMobile || !props.isShowing) {
    return null;
  }

  const items = [];
  for (let i = 0; i < props.items.length; i++) {
    const item = props.items[i];
    const element = (
      <div
        key={`navMenuItem${i}`}
        className="first:border-t-0 border-t border-gray-200"
      >
        <button
          onClick={item.action}
          className="block py-3 text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          {item.label}
        </button>
      </div>
    );
    items.push(element);
  }

  return (
    <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">{items}</div>
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
        className="w-8 h-8 bg-blue-700 rounded-full"
        onClick={onClick}
      ></button>
    </div>
  );
};

const DropDownMenu: React.FC<NavMenuCommonProps> = (props) => {
  React.useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        props.wrapperRef.current &&
        !props.wrapperRef.current.contains(event.target) &&
        !props.isMobile
      ) {
        console.log("handle bg click");
        props.setIsShowing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props.wrapperRef, props.isMobile]);

  if (!props.isShowing || props.isMobile) {
    return null;
  }

  const items = [];
  for (let i = 0; i < props.items.length; i++) {
    const item = props.items[i];
    const element = (
      <div key={`navMenuItem${i}`}>
        <button
          onClick={item.action}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          {item.label}
        </button>
      </div>
    );
    items.push(element);
  }

  return (
    <div className="origin-top-right absolute right-0 top-16 w-72 p-2 rounded-md bg-white border border-black border-opacity-10 focus:outline-none">
      {items}
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

interface NavMenuItem {
  label: string;
  action: any;
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
        <div className="flex justify-between m-auto w-full max-w-6xl">
          {siteTitle}
          {profile}
          {token}
          <div className="relative" ref={wrapperRef}>
            <NavBarPopupMenu {...navCommonProps} />
            <DropDownMenu {...navCommonProps} />
          </div>
        </div>
      </div>
      <NavMobileMenu {...navCommonProps} />
    </div>
  );
};

export default NavBar;
