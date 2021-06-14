import { Link } from "gatsby";
import * as React from "react";
import FooView from "../components/foo/FooView";
import FooPostGallery from "../components/foo/posts/FooPostGallery";
import FooWritePostView from "../components/foo/posts/FooWritePostView";

interface LandingProps {
  path: string;
}

const Landing: React.FC<LandingProps> = (props) => {
  return (
    <>
      <FooWritePostView />
      <FooPostGallery />
      <FooView />
    </>
  );
};

export default Landing;
