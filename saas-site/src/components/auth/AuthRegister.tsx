import { Link } from "gatsby";
import * as React from "react";
import { ReactNode } from "react";
import AuthApi from "../../api/auth/AuthApi";
import AuthResponse from "../../api/auth/AuthResponse";
import { SubComponentBaseProps, withApiWrapper } from "./ApiComponentWrapper";
import { ApiState } from "./ApiState";
import AuthCommonComponent from "./AuthCommonComponent";

const createButton = (label: string, onClick: any, isDisabled: boolean) => {
  return (
    <div className="w-full mt-4 flex">
      <button
        className="p-3 bg-blue-600 text-white font-semibold rounded-md w-full m-auto"
        type="button"
        onClick={onClick}
        disabled={isDisabled}
      >
        {label}
      </button>
    </div>
  );
};

class StringField {
  public label: string;
  public value: string;
  public setValue: React.Dispatch<React.SetStateAction<string>>;

  public static fromHook(
    label: string,
    stateHook: [string, React.Dispatch<React.SetStateAction<string>>]
  ) {
    const field = new StringField();
    field.label = label;
    field.value = stateHook[0];
    field.setValue = stateHook[1];
    return field;
  }

  public asComponent(isDisabled: boolean) {
    return (
      <div className="w-full">
        <div className="text-sm font-bold mb-1 text-gray-600">{this.label}</div>
        <input
          className="border mb-5 p-2 border-gray-300 rounded-md w-full text-gray-700"
          type="text"
          defaultValue={this.value.toString()}
          onChange={(e) => this.setValue(e.currentTarget.value)}
          disabled={isDisabled}
        />
      </div>
    );
  }
}

const AuthRegister: React.FC<SubComponentBaseProps> = (props) => {
  const emailField = StringField.fromHook("Email", React.useState(""));
  const passwordField = StringField.fromHook("Password", React.useState(""));

  const onCustomFault = (x: any) => {
    console.log("Custom Fault Detected!");
    props.onApiFault(x);
  };

  const onRegister = () => {
    console.log("Register with ", emailField.value, passwordField.value);
    props.onApiRequest();
    AuthApi.delayedError().then(props.onApiResponse).catch(onCustomFault);
  };

  const isDisabled: boolean = props.apiState.isBusy;

  return (
    <AuthCommonComponent apiState={props.apiState}>
      {emailField.asComponent(isDisabled)}
      {passwordField.asComponent(isDisabled)}
      {createButton("Register", onRegister, isDisabled)}
    </AuthCommonComponent>
  );
};

export const WrappedAuthRegister = withApiWrapper(AuthRegister);
