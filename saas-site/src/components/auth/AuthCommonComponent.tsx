import { Link } from "gatsby";
import React from "react";
import { ApiState } from "./ApiState";

const AuthCommonComponent: React.FC<{ apiState: ApiState }> = (props) => {
  const errorElement = props.apiState.hasError ? (
    <div className="text-red-500">Error: {props.apiState.errorMessage}</div>
  ) : null;

  return (
    <div className="bg-white p-8 border border-gray-300 rounded-md max-w-md">
      <h1 className="text-2xl font-light mb-8 text-gray-700">
        Create a new account.
      </h1>
      {props.children}
      {errorElement}
    </div>
  );
};

export default AuthCommonComponent;
