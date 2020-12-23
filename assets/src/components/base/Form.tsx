import React from "react";

import "./Form.scss";

export type FormProps = {
  children: React.ReactNode;
  onSubmit: () => void;
};

const Form = ({ children }: FormProps) => {
  return (<ul className="Form">{ children }</ul>);
};

type FieldType = "text" | "checkbox" | "timespan";

export type FieldProps = {
  name: string;
  type: FieldType;
  label: string;
  value: any;
};

const Field = ({ name, type, label }: FieldProps) => {
  return (<li className="Form-item">{label}</li>);
};

export { Field };
export default Form;
