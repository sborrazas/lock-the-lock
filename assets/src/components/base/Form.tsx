import React, { ChangeEvent } from "react";
import { cssClasses } from "../../helpers/css";

import "./Form.scss";

export type FormProps = {
  children: React.ReactNode;
  onSubmit: () => void;
};

const Form = ({ children }: FormProps) => {
  return (<form className="Form">{children}</form>);
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
            return (<option value={value}>{label}</option>);
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

const parseTimespan = (val: string): [number, number] => {
  const match = val.match(/^(\d\d):(\d\d)$/);

  if (!match) throw new Error("Invalid timespan format");

  return [parseInt(match[1], 10), parseInt(match[2], 10)];
};

const formatTimestamp = (min: number, sec: number): string => {
  return [min, sec].map(n => {
    return n < 10 ? `0${n}` : n;
  }).join(":");
};

class TimespanInput extends React.Component<InputProps> {
  constructor(props: InputProps) {
    super(props);

    this._onChangeMinute = this._onChangeMinute.bind(this);
    this._onChangeSecond = this._onChangeSecond.bind(this);
  }

  render() {
    const { id, name, value } = this.props;
    const minutesOptions = Array.from(Array(10).keys()).map((n) => {
      return { value: n, label: `${n}` };
    });
    const secondsOptions = Array.from(Array(59).keys()).map((n) => {
      return { value: n, label: `${n}` };
    });
    const [minutes, seconds] = parseTimespan(value);

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

  _onChangeMinute(minute: number) {
    const { value, onChange } = this.props;
    const [, second] = parseTimespan(value);

    onChange(formatTimestamp(minute, second));
  }

  _onChangeSecond(second: number) {
    const { value, onChange } = this.props;
    const [minute,] = parseTimespan(value);

    onChange(formatTimestamp(minute, second));
  }
};

export type FieldProps = {
  type: "text" | "timespan" | "checkbox" | "select",
  label: string;
} & InputProps;

const INPUT_TYPE_MAP = {
  "text": TextInput,
  "checkbox": CheckboxInput,
  "timespan": TimespanInput,
  "select": SelectInput
};

const Field = (props: FieldProps) => {
  const { id, label, type } = props;
  const Input = INPUT_TYPE_MAP[type];

  return (
    <div className="Form-field">
      <label className="Form-fieldLabel" htmlFor={id}>{label}</label>
      <Input {...props} />
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
