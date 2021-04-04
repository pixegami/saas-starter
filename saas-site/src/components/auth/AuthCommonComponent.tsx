import { Link } from "gatsby";
import React, { ReactNode } from "react";
import { ApiState } from "./ApiState";

const createErrorElement = (message: string) => {
  return (
    <div className="text-red-600 bg-red-100 p-3 border-red-600 mb-6 rounded-md text-sm">
      Error: {message}
    </div>
  );
};

const AuthCommonComponent: React.FC<{
  apiState: ApiState;
}> = (props) => {
  const errorElement = props.apiState.hasError
    ? createErrorElement(props.apiState.errorMessage)
    : null;

  return (
    <div className="bg-white md:p-8 p-4 border border-gray-300 rounded-md max-w-md">
      <h1 className="text-2xl font-light mb-6 text-gray-700">
        Create a new account.
      </h1>
      {errorElement}

      {props.children}
    </div>
  );
};

export default AuthCommonComponent;
