import { Link } from "gatsby";
import React from "react";

interface ApiTextLinkProps {
  preLinkText?: string;
  linkPath: string;
  linkText: string;
}

const ApiTextLink: React.FC<ApiTextLinkProps> = (props) => {
  const preTextElement = props.preLinkText ? (
    <div>{props.preLinkText}</div>
  ) : null;

  return (
    <div className="text-gray-600 text-sm flex space-x-1 justify-center">
      {preTextElement}
      <Link to={props.linkPath} className="text-blue-600 hover:underline">
        {props.linkText}
      </Link>
    </div>
  );
};

export default ApiTextLink;
