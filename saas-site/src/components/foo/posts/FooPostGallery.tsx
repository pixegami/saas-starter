import * as React from "react";
import withBoxStyling from "../../hoc/withBoxStyling";
import FooPostCard from "./FooPostCard";

interface FooPostGalleryProps {}

const FooPostGallery: React.FC<FooPostGalleryProps> = (props) => {
  const posts = [];

  for (let i = 0; i < 10; i++) {
    const newPost = (
      <FooPostCard
        title="Hello world."
        content="A quick brown fox jumped over the lazy dog."
        author="aCoolUser"
        key={"post" + i}
      />
    );
    posts.push(newPost);
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Recent Posts</h1>
      <div>{posts}</div>
    </>
  );
};

export default withBoxStyling(FooPostGallery);
