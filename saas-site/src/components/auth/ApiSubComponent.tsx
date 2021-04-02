import React from "react";
import { SubComponentBaseProps, withApiWrapper } from "./ApiComponentWrapper";
import { newApiState } from "./ApiState";

const ApiSubComponent: React.FC<SubComponentBaseProps> = (props) => {
  const onClick = () => {
    props.setVar(props.v1 + 1);
    props.setAuthState(newApiState({ isBusy: true }));
  };

  console.log(props.authState);

  return (
    <div>
      I'm an Api Subcomponent! My key is: {props.v1}
      <button onClick={onClick}>Click me</button>
      Is busy: {props.authState.isBusy.toString()}
    </div>
  );
};

export const WrappedApiSubComponent = withApiWrapper(ApiSubComponent);
