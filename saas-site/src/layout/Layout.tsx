import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <>
      <div className="p-2 md:p-4">
        <div className="max-w-4xl m-auto">{props.children}</div>
      </div>
    </>
  );
};

export default Layout;
