import React from "react";
import useRenderKey from "../components/util/functions/useRenderKey";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const renderKey = useRenderKey();

  return (
    <>
      <div className="p-2 md:p-4" key={renderKey.key}>
        <div className="max-w-4xl m-auto">{props.children}</div>
      </div>
    </>
  );
};

export default Layout;
