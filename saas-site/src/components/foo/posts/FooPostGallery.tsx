import * as React from "react";
import withBoxStyling from "../../hoc/withBoxStyling";
import FooPostCard from "./FooPostCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import {
  SubComponentBaseProps,
  withApiWrapper,
} from "../../api/ApiComponentWrapper";
import FooApi from "../../../api/foo/FooApi";
import { FooPost } from "../../../api/foo/FooResponse";

interface FooPostGalleryProps extends SubComponentBaseProps {
  postRefreshId?: string;
}

interface RefreshComponentProps {
  isRefreshing: boolean;
  onClickRefresh: React.MouseEventHandler<HTMLButtonElement>;
}

const RefreshComponent: React.FC<RefreshComponentProps> = (
  props: RefreshComponentProps
) => {
  let displayableElement;
  if (props.isRefreshing) {
    displayableElement = (
      <div>
        <div className="w-7 h-7 flex">
          <div className="loader-dark" />
        </div>
      </div>
    );
  } else {
    displayableElement = (
      <button onClick={props.onClickRefresh}>
        <FontAwesomeIcon className="fa-lg text-gray-600" icon={faSyncAlt} />
      </button>
    );
  }

  return <div className="my-auto">{displayableElement}</div>;
};

const FooPostGallery: React.FC<FooPostGalleryProps> = (props) => {
  const [rawPosts, setRawPosts] = React.useState<FooPost[]>([]);

  const onClickRefresh = () => {
    refreshPosts();
  };

  const refreshPosts = () => {
    console.log("Refreshing Post for UUID: " + props.postRefreshId);
    let isMounted: boolean = true;
    props.onApiRequest();
    FooApi.getPosts()
      .then((r) => {
        if (isMounted) {
          console.log(r.items);
          setRawPosts(r.items);
          props.onApiResponse(r);
        }
      })
      .catch((r) => {
        if (isMounted) {
          console.log(r.items);
          props.onApiFault(r);
        }
      });

    return () => {
      isMounted = false;
    };
  };

  // Load the posts on page load.
  React.useEffect(refreshPosts, [props.postRefreshId]);

  let postsElement;
  const thereArePosts = rawPosts.length > 0;
  if (thereArePosts) {
    const posts = [];
    for (let i = 0; i < rawPosts.length; i++) {
      const rawPost = rawPosts[i];
      const newPost = (
        <FooPostCard
          title="Untitled"
          content={rawPost.content}
          author={rawPost.user.substr(0, 8)}
          key={rawPost.key}
        />
      );
      posts.push(newPost);
    }
    postsElement = <div>{posts}</div>;
  } else {
    postsElement = <div>No posts!</div>;
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold my-auto">Recent Posts</h1>
        <RefreshComponent
          onClickRefresh={onClickRefresh}
          isRefreshing={props.apiState.isBusy}
        />
      </div>
      <div>{postsElement}</div>
    </>
  );
};

export default withBoxStyling(withApiWrapper(FooPostGallery));
