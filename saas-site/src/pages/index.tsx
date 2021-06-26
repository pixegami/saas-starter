import { navigate } from "@reach/router";
import { Link } from "gatsby";
import * as React from "react";
import Landing from "../app/landing";
import { HOME } from "../components/auth/route/AuthURL";
import { ApiButton } from "../components/util/base_api_components/ApiButton";

const IndexPage = () => {
  return (
    <div className="p-2 md:p-4 h-screen">
      <div className="max-w-4xl m-auto bg-white rounded-md flex p-4">
        <div className="my-4 w-full text-center p-4">
          <h1 className="text-3xl font-bold">Bonestack</h1>
          <div>A boilerplate app with authentication and payments.</div>
          <div className="mt-8 flex">
            <Link
              to={HOME}
              className="bg-blue-600 py-3 px-6 text-white font-bold rounded-md mx-auto w-64"
            >
              Try it
            </Link>
          </div>

          {/* <ApiButton label={"Try it"} onClick={() => navigate(HOME)} /> */}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
