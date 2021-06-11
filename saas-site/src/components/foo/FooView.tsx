import * as React from "react";
import withBoxStyling from "../hoc/withBoxStyling";

interface FooViewProps {}

const FooView: React.FC<FooViewProps> = (props) => {
  return (
    <div>
      <h1 className="text-xl font-bold">Foo Service</h1>
      <div className="bg-blue-100 rounded-md p-4 text-blue-900 mt-2">
        Your service status...
      </div>
    </div>
  );
};

export default withBoxStyling(FooView);
