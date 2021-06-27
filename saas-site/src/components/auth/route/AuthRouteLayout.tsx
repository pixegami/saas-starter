import * as React from "react";
import NavBar from "../../navbar/NavBar";

const AuthRouteLayout = ({ children }) => {
  return (
    <>
      {children}
      {/* <NavBar />
      <div className="p-2 md:p-4">
        <div className="max-w-4xl m-auto">{children}</div>
      </div> */}
    </>
  );
};

export default AuthRouteLayout;
