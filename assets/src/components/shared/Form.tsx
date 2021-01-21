import React, { FunctionComponent } from "react";
import { connect } from "react-redux";

import { RootState } from "../../resources/reducer";
import UiForm, {
  Field as UiFormField,
  FormProps as UiFormProps,
  FieldProps as UiFieldProps
} from "../base/Form";
import { Form as FormsForm } from "../../utils/forms";
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
} & Omit<UiFieldProps, "id" | "name" | "value" | "onChange" | "errors">;

type PropsFromRedux<K extends keyof UiForms> = {
  form: FormsForm<UiForms[K]>;
  updateField: (formName: K, changes: Partial<UiForms[K]>) => void;
};

type FieldProps<K extends keyof UiForms, F extends keyof UiForms[K] & string> =
  PropsFromRedux<K> &
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
    form: selectForm<K>(state.ui, formName) as FormsForm<UiForms[K]>
  };
};

const ConnectedField = (<K extends keyof UiForms, F extends keyof UiForms[K] & string>(): FunctionComponent<OwnFieldProps<K, F>> => {
  const updateField2 = (formName: K, changes: Partial<UiForms[K]>) => updateField(formName, changes);

  return connect<{ form: FormsForm<UiForms[K]> },
                 { updateField: (formName: K, changes: Partial<UiForms[K]>) => void},
                 OwnFieldProps<K, F>,
                 RootState>(mapStateToProps, { updateField: updateField2 })(Field as new(props: FieldProps<K, F>) => Field<K, F>);
});

const ConnectedField3 = <K extends keyof UiForms, F extends keyof UiForms[K] & string>(props: OwnFieldProps<K, F>) => {
  const ConnectedField2 = ConnectedField<K, F>();

  return (<ConnectedField2 {...props} />);
};

export {
  ConnectedField3 as Field
};

export default Form;
