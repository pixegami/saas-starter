import { Link, navigate } from "gatsby";
import * as React from "react";
import withBoxStyling from "../../hoc/withBoxStyling";
import * as AuthURL from "../../auth/route/AuthURL";
import AuthApi from "../../../api/auth/AuthApi";

interface FooWritePostViewProps {}

const postEnabledView = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [postContent, setPostContent] = React.useState("");
  const onClickPost = () => {
    setIsLoading(true);
  };

  const buttonLabel = isLoading ? (
    <div className="w-6 h-6 flex m-auto">
      <div className="loader" />
    </div>
  ) : (
    "Post"
  );

  return (
    <div>
      <textarea
        id="message"
        name="message"
        rows={2}
        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block 
          w-full sm:text-sm border border-gray-300 rounded-md disabled:opacity-50
          p-2"
        placeholder="Write your message here..."
        defaultValue={postContent}
        onChange={(e) => {
          setPostContent(e.currentTarget.value);
        }}
        disabled={isLoading}
      ></textarea>
      <div className="mt-4 flex w-full">
        <div className="ml-auto my-auto">
          <button
            className="rounded-md bg-blue-600 text-white px-4 py-2 font-bold w-32 disabled:opacity-50"
            disabled={isLoading}
            onClick={onClickPost}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const postDisabledView = () => {
  const goToSignIn = () => navigate(AuthURL.SIGN_IN);

  return (
    <div className="text-center flex w-full bg-gray-100 p-4 rounded-md">
      <div className="m-auto">
        <div className="text-gray-600 mb-4">You must be signed in to post.</div>

        <button
          className="rounded-md bg-blue-600 text-white px-4 py-2 font-bold w-32"
          onClick={goToSignIn}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

const FooWritePostView: React.FC<FooWritePostViewProps> = (props) => {
  const isSignedIn: boolean = AuthApi.isSignedIn();
  const postView = isSignedIn ? postEnabledView() : postDisabledView();

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Write a post</h1>
      {postView}
    </>
  );
};

export default withBoxStyling(FooWritePostView);
