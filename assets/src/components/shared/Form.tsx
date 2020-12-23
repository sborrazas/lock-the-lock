import React from "react";

import UiForm, {
  Field as UiFormField,
  FormProps as UiFormProps,
  FieldProps as UiFieldProps
} from "../base/Form";
import { Form as FormsForm } from "../../resources/shared/forms/reducer";

type FormProps<T> = Omit<UiFormProps, "onSubmit"> & {
  children: React.ReactNode;
  onSubmit: (resource: T) => void;
  form: FormsForm<T>;
};

const Form = <T extends {}>({ children, onSubmit, form }: FormProps<T>) => {
  return (<UiForm onSubmit={() => onSubmit(form.entity)}>{children}</UiForm>);
};

type FieldProps<T> = Omit<UiFieldProps, "name" | "value"> & {
  name: string;
  form: FormsForm<T>;
};

const Field = <T extends {}>({ name, type, label, form }: FieldProps<T>) => {
  return (
    <UiFormField name={name} type={type} label={label} value={"aa"} />
  );
};

export { Field };
export default Form;
