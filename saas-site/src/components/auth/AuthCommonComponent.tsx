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
  header: string;
}> = (props) => {
  const errorElement = props.apiState.hasError
    ? createErrorElement(props.apiState.errorMessage)
    : null;

  return (
    <div className="bg-white md:p-8 px-4 py-6 border border-gray-300 rounded-md max-w-lg  m-2 md:m-auto mt-4 md:mt-8">
      <h1 className="text-2xl font-light mb-6 text-gray-700">{props.header}</h1>
      {errorElement}
      {props.children}
    </div>
  );
};

export default AuthCommonComponent;
