import React, { ChangeEvent } from "react";

import "./Form.scss";

export type FormProps = {
  children: React.ReactNode;
  onSubmit: () => void;
};

const Form = ({ children }: FormProps) => {
  return (<form className="Form">{children}</form>);
};

type InputProps = {
  name: string;
  value: any;
  onChange: (val: string) => void;
};

class TextInput extends React.Component<InputProps> {
  constructor(props: InputProps) {
    super(props);

    this._onChange = this._onChange.bind(this);
  }

  render() {
    const { name, value } = this.props;

    return (
      <input type="text" name={name} value={value} onChange={this._onChange} />
    );
  }

  _onChange(e: ChangeEvent<HTMLInputElement>) {
    const { onChange } = this.props;

    onChange(e.target.value);
  }
};

const CheckboxInput = ({ name, value }: InputProps) => {
  return (<div></div>);
};

const TimespanInput = ({ name, value }: InputProps) => {
  return (<div></div>);
};

type FieldType = "text" | "checkbox" | "timespan";

export type FieldProps = {
  type: FieldType;
  label: string;
} & InputProps;

const INPUT_TYPE_MAP = {
  "text": TextInput,
  "checkbox": CheckboxInput,
  "timespan": TimespanInput
};

const Field = ({ name, type, label, value, onChange }: FieldProps) => {
   const Input = INPUT_TYPE_MAP[type];

  return (
    <div className="Form-field">
      <label htmlFor={""}>{label}</label>
      <Input name={name} value={value} onChange={onChange} />
    </div>
  );
};

export { Field };
export default Form;
