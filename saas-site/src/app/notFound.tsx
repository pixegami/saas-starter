import * as React from "react";

interface NotFoundProps {
  default: boolean;
}

const NotFound: React.FC<NotFoundProps> = (props) => {
  return (
    <div>
      <h1>Page Not Found!</h1>
    </div>
  );
};

export default NotFound;
