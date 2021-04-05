import * as React from "react";
import NavBar from "./navbar/NavBar";

const AuthRouteLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="p-2 md:p-4">
        <div className="max-w-6xl m-auto">{children}</div>
      </div>
    </>
  );
};

export default AuthRouteLayout;
