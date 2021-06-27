import * as React from "react";

interface PageNotFoundProps {
  default?: boolean;
}

const PageNotFound: React.FC<PageNotFoundProps> = (props) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading</div>;
  } else {
    return (
      <div>
        <div className="text-2xl text-center">Page Not Found</div>
      </div>
    );
  }
};

export default PageNotFound;
