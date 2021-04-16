import { Link } from "gatsby";
import * as React from "react";

interface LandingProps {
  path: string;
}

const Landing: React.FC<LandingProps> = (props) => {
  return (
    <div>
      <h1>This is a landing page. You will see it whether logged in or not.</h1>
      <Link to="/app/sign_in" className="border border-black m-1 p-1">
        Sign In
      </Link>
    </div>
  );
};

export default Landing;
