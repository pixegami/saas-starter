import * as React from "react";

interface FooPostCardProps {
  title: string;
  content: string;
  author: string;
}

const FooPostCard: React.FC<FooPostCardProps> = (props) => {
  return (
    <div className="mb-4 p-2 bg-gray-50">
      <div className="flex justify-between">
        <div className="font-bold">{props.title}</div>
        <div className="text-sm text-blue-600 mb-1">by {props.author}</div>
      </div>

      <div className="text-gray-500">{props.content}</div>
    </div>
  );
};

export default FooPostCard;
