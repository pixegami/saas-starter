import React from "react";

export class ApiStringField {
  public label: string;
  public value: string;
  public setValue: React.Dispatch<React.SetStateAction<string>>;

  public static fromHook(
    label: string,
    stateHook: [string, React.Dispatch<React.SetStateAction<string>>]
  ) {
    const field = new ApiStringField();
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
          className="border mb-5 p-2 border-gray-300 rounded-md w-full text-gray-700 
              disabled:opacity-70 disabled:bg-gray-100"
          type="text"
          defaultValue={this.value.toString()}
          onChange={(e) => this.setValue(e.currentTarget.value)}
          disabled={isDisabled}
        />
      </div>
    );
  }
}
