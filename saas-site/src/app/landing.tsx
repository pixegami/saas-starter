import { Link } from "gatsby";
import * as React from "react";
import FooView from "../components/foo/FooView";
import FooPostGallery from "../components/foo/posts/FooPostGallery";

interface LandingProps {
  path: string;
}

const Landing: React.FC<LandingProps> = (props) => {
  return (
    <>
      <FooView />
      <FooPostGallery />
    </>
  );
};

export default Landing;
