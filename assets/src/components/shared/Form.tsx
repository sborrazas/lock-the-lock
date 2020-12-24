import React from "react";
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "../../resources/reducer";
import UiForm, {
  Field as UiFormField,
  FormProps as UiFormProps,
  FieldProps as UiFieldProps
} from "../base/Form";
import { Form as FormsForm } from "../../resources/shared/forms/reducer";
import { updateField, FormsActionTypes } from "../../resources/shared/forms/actions";

import { UiForms } from "../../resources/ui/types";

type FormProps<K extends keyof UiForms> = Omit<UiFormProps, "onSubmit"> & {
  children: React.ReactNode;
  formName: K;
  form: FormsForm<UiForms[K]>;
  onSubmit: (resource: UiForms[K]) => void;
};

const Form = <T extends keyof UiForms>({ children, onSubmit, form }: FormProps<T>) => {
  return (
    <UiForm onSubmit={() => onSubmit(form.entity)}>
      {children}
    </UiForm>
  );
};

const connector = connect((state: RootState) => {
  return {
  };
}, { updateField });

type PropsFromRedux = ConnectedProps<typeof connector>;

type FieldProps<K extends keyof UiForms> = PropsFromRedux &
                                           Omit<UiFieldProps, "name" | "value" | "onChange"> & {
  formName: K;
  form: FormsForm<UiForms[K]>;
  name: keyof UiForms[K] & string;
};

const Field = <K extends keyof UiForms>({ formName, name, type, label, form, updateField }: FieldProps<K>) => {
  const onChange = (val: any) => {
    const changes: Partial<UiForms[K]> = {};

    changes[name] = val;

    updateField(formName, changes);
  };

  return (
    <UiFormField name={name} type={type} label={label} value={form.entity[name]} onChange={onChange} />
  );
};

const ConnectedField = connector(Field);

export {
  ConnectedField as Field
};
export default Form;
