import * as React from "react";
import NavBar from "./navbar/NavBar";

const AuthRouteLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="m-auto p-2 md:p-4 max-w-6xl">{children}</div>
    </>
  );
};

export default AuthRouteLayout;
