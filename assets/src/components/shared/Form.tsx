import React from "react";
import { connect } from "react-redux";

import { RootState } from "../../resources/reducer";
import UiForm, {
  Field as UiFormField,
  FormProps as UiFormProps,
  FieldProps as UiFieldProps
} from "../base/Form";
import { Form as FormsForm, FError as FormsError } from "../../utils/forms";
import { updateField } from "../../resources/shared/forms/actions";

import { UiForms } from "../../resources/ui/types";
import { selectForm } from "../../resources/ui/reducer";

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

type OwnFieldProps<K extends keyof UiForms, F extends keyof UiForms[K] & string> = {
  formName: K;
  name: F;
};

type PropsFromRedux<K extends keyof UiForms, F extends keyof UiForms[K] & string> = {
  form: FormsForm<UiForms[K]>;
  updateField: (formName: K, changes: Partial<UiForms[K]>) => void;
};

type FieldProps<K extends keyof UiForms, F extends keyof UiForms[K] & string> =
  PropsFromRedux<K, F> &
  Omit<UiFieldProps, "id" | "name" | "value" | "onChange" | "errors"> &
  OwnFieldProps<K, F>;

class Field<K extends keyof UiForms, F extends keyof UiForms[K] & string> extends React.Component<FieldProps<K, F>> {
  render() {
    const { formName, name, type, label, form, updateField } = this.props;
    const id = `${formName}_${name}`;

    const onChange = (val: any) => {
      const changes: Partial<UiForms[K]> = {};

      changes[name] = val;

      updateField(formName, changes);
    };

    return (
      <UiFormField
        id={id}
        name={name}
        type={type}
        label={label}
        errors={form.errors[name] || []}
        value={form.entity[name]}
        onChange={onChange} />
    );
  }
};

const mapStateToProps = <K extends keyof UiForms, F extends keyof UiForms[K] & string>(state: RootState, { formName, name }: OwnFieldProps<K, F>): { form: FormsForm<UiForms[K]> } => {
  return {
    form: selectForm(state.ui, formName) as FormsForm<UiForms[K]>
  };
};

const ConnectedField = (<K extends keyof UiForms, F extends keyof UiForms[K] & string>() => {
  return connect<{ form: FormsForm<UiForms[K]> },
                 { updateField: (formName: K, changes: Partial<UiForms[K]>) => void},
                 OwnFieldProps<K, F>,
                 RootState>(mapStateToProps, { updateField })(Field as new(props: FieldProps<K, F>) => Field<K, F>);
})();

export {
  ConnectedField as Field
};

export default Form;
