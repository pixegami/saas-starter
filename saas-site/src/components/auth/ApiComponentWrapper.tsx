import React, { Component, FunctionComponent } from "react";
import ApiResponse from "../../api/ApiResponse";
import { ApiState, newApiState } from "./ApiState";

export interface SubComponentBaseProps {
  v1: number;
  setVar(x: number): void;
  authState: ApiState;
  setAuthState(x: ApiState): void;
}

const ApiComponentWrapper = ({
  subComponent: FunctionComponent,
  path: string,
  ...rest
}) => {
  const [x, setX] = React.useState(0);
  const [authState, setAuthState] = React.useState(newApiState());

  const subProps: SubComponentBaseProps = {
    v1: x,
    setVar: setX,
    authState,
    setAuthState,
  };

  return (
    <>
      I'm a wrapper for:
      <FunctionComponent<SubComponentBaseProps> {...rest} {...subProps} />
    </>
  );

  // const [authState, setAuthState] = React.useState(newDefaultAuthState());
  // const setAuthStateWithOverride = (override: AuthStateOverride) => {
  //   setAuthState(newAuthState(override));
  // };

  // // on Success Response.
  // // on ApiRequest function.

  // const onApiResponse = (response: ApiResponse) => {
  //   if (response.status == 200) {
  //     setAuthStateWithOverride({ isBusy: false });
  //   } else {
  //     setAuthStateWithOverride({
  //       hasError: true,
  //       errorMessage: response.message,
  //     });
  //   }
  // };

  // const onApiFault = (x: any) => {
  //   setAuthStateWithOverride({
  //     hasError: true,
  //     errorMessage: `Something unexpected happened! [${x}]`,
  //   });
  // };

  // const onApiRequest = () => {
  //   setAuthStateWithOverride({ isBusy: true });
  //   // AuthApi.delayedFault().then(onApiResponse).catch(onApiFault);
  // };
};

export const withApiWrapper = (
  subComponent: FunctionComponent<SubComponentBaseProps>
) => ({ path: string, ...props }) => {
  return (
    <ApiComponentWrapper
      subComponent={subComponent}
      path={props.path}
      {...props}
    />
  );
};

export default ApiComponentWrapper;
