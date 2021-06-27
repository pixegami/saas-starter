import React from "react";
import AuthProvider from "../components/auth/route/AuthProvider";
import NavBar from "../components/navbar/NavBar";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <>
      <AuthProvider>
        <NavBar {...props} />
        <div className="p-2 md:p-4">
          <div className="max-w-4xl m-auto">{props.children}</div>
        </div>
      </AuthProvider>
    </>
  );
};

export default Layout;
