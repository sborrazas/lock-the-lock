import React, { ChangeEvent, FormEvent } from "react";
import { cssClasses } from "../../helpers/css";
import { FError } from "../../utils/forms";

import "./Form.scss";

export type FormProps = {
  children: React.ReactNode;
  onSubmit: () => void;
};

class Form extends React.Component<FormProps> {
  constructor(props: FormProps) {
    super(props);

    this._onSubmit = this._onSubmit.bind(this);
  }

  render() {
    const { children } = this.props;

    return (
      <form className="Form" onSubmit={this._onSubmit}>{children}</form>
    );
  }

  _onSubmit(e: FormEvent<HTMLFormElement>) {
    const { onSubmit } = this.props;

    e.preventDefault();

    onSubmit();
  }
};

type InputProps = {
  id: string;
  name: string;
  value: any;
  onChange: (val: any) => void;
  options?: Array<{ value: any, label: string }>;
  inline?: boolean;
};

class TextInput extends React.Component<InputProps> {
  constructor(props: InputProps) {
    super(props);

    this._onChange = this._onChange.bind(this);
  }

  render() {
    const { id, name, value } = this.props;

    return (
      <input
        id={id}
        className="Form-fieldInput Form-fieldInput--text"
        type="text"
        name={name}
        value={value}
        onChange={this._onChange} />
    );
  }

  _onChange(e: ChangeEvent<HTMLInputElement>) {
    const { onChange } = this.props;

    onChange(e.target.value);
  }
};

class CheckboxInput extends React.Component<InputProps> {
  constructor(props: InputProps) {
    super(props);

    this._onChange = this._onChange.bind(this);
  }

  render() {
    const { id, name, value } = this.props;

    return (
      <input
        id={id}
        className="Form-fieldInput Form-fieldInput--checkbox"
        type="checkbox"
        name={name}
        checked={value}
        onChange={this._onChange} />
    );
  }

  _onChange(e: ChangeEvent<HTMLInputElement>) {
    const { onChange, value } = this.props;

    onChange(!value);
  }
};

class SelectInput extends React.Component<InputProps> {
  constructor(props: InputProps) {
    super(props);

    this._onChange = this._onChange.bind(this);
  }

  render() {
    const { id, name, value, options, inline } = this.props;

    if (!options) throw new Error("Invalid options"); // Run-time check :(

    const className = cssClasses({
      "Form-fieldInput": true,
      "Form-fieldInput--select": true,
      "Form-fieldInput--inline": !!inline
    });

    return (
      <select
        id={id}
        className={className}
        name={name}
        value={value}
        onChange={this._onChange}>
        {
          options.map(({ value, label }) => {
            return (<option key={value} value={value}>{label}</option>);
          })
        }
      </select>
    );
  }

  _onChange(e: ChangeEvent<HTMLSelectElement>) {
    const { onChange } = this.props;

    onChange(e.target.value);
  }
};

const formatTimestamp = (n: number): string => {
  return n < 10 ? `0${n}` : `${n}`;
};

class TimespanInput extends React.Component<InputProps> {
  constructor(props: InputProps) {
    super(props);

    this._onChangeMinute = this._onChangeMinute.bind(this);
    this._onChangeSecond = this._onChangeSecond.bind(this);
  }

  render() {
    const { id, name, value } = this.props;
    const minutesOptions = Array.from(Array(11).keys()).map((n) => {
      return { value: n, label: formatTimestamp(n) };
    });
    const secondsOptions = Array.from(Array(60).keys()).map((n) => {
      return { value: n, label: formatTimestamp(n) };
    });
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;

    return (
      <div className="Form-fieldInput Form-fieldInput--timespan">
        <SelectInput
          id={id}
          name={`${name}_minutes`}
          inline={true}
          value={minutes}
          onChange={this._onChangeMinute}
          options={minutesOptions} />
        min
        <SelectInput
          id={`${id}_seconds`}
          name={`${name}_seconds`}
          inline={true}
          value={seconds}
          onChange={this._onChangeSecond}
          options={secondsOptions} />
        sec
      </div>
    );
  }

  _onChangeMinute(minuteStr: string) {
    const minute = parseInt(minuteStr, 10);
    const { value, onChange } = this.props;
    const second = value % 60;

    console.log("changing minute", value, minute);

    onChange(minute * 60 + second);
  }

  _onChangeSecond(secondStr: string) {
    const second = parseInt(secondStr, 10);
    const { value, onChange } = this.props;
    const minute = Math.floor(value / 60);

    console.log("changing second", value, second);

    onChange(minute * 60 + second);
  }
};

type FieldErrorsProps = {
  errors: Array<FError>;
};

const FieldErrors = ({ errors }: FieldErrorsProps) => {
  return (
    <ul>
      {
        errors.map(() => {
          return (<li>Err</li>);
        })
      }
    </ul>
  );
};

export type FieldProps = {
  type: "text" | "timespan" | "checkbox" | "select",
  label: string;
  errors?: Array<FError>;
} & InputProps;

const INPUT_TYPE_MAP = {
  "text": TextInput,
  "checkbox": CheckboxInput,
  "timespan": TimespanInput,
  "select": SelectInput
};

const Field = (props: FieldProps) => {
  const { id, label, type, errors } = props;
  const Input = INPUT_TYPE_MAP[type];

  return (
    <div className="Form-field">
      <label className="Form-fieldLabel" htmlFor={id}>{label}</label>
      <Input {...props} />
      {
        errors &&
          <FieldErrors errors={errors} />
      }
    </div>
  );
};

export type NavProps = {
  children: React.ReactNode;
};

const Nav = ({ children }: NavProps) => {
  return (
    <nav className="Form-nav">
      {children}
    </nav>
  );
};


export { Field, Nav };
export default Form;
