import React from "react";
import AuthApi from "../../api/auth/AuthApi";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = (props) => {
  const siteTitle = <div>Saas Starter</div>;
  const profile = <div>Profile</div>;
  const token = AuthApi.getSessionToken();

  return (
    <div className="bg-gray-400 p-2 pt-4 pb-4 md:p-4 mb-2 flex">
      <div className="flex m-auto w-full max-w-6xl border border-red-500 justify-between">
        {siteTitle}
        {profile}
        {token}
      </div>
    </div>
  );
};

export default NavBar;
