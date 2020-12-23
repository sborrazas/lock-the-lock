import { Action } from "redux";

export const INITIALIZE = "FORM__INITIALIZE";

interface InitializeForm<T> extends Action {
  type: typeof INITIALIZE,
  payload: {
    formName: keyof T;
  }
};

export const UPDATE_FIELDS =  "FORM__UPDATE_FIELDS";


interface UpdateFieldsAction<T, K extends keyof T> extends Action {
  type: typeof UPDATE_FIELDS;
  payload: {
    formName: K;
    changes: Partial<T[K]>;
  }
};

export type FormsActionTypes<T> = InitializeForm<T> | UpdateFieldsAction<T, keyof T>;

export function initializeForm<T>(formName: keyof T): FormsActionTypes<T> {
  return {
    type: INITIALIZE,
    payload: {
      formName
    }
  };
};

export function updateField<T, K extends keyof T>(formName: K, changes: Partial<T[K]>): FormsActionTypes<T> {
  return {
    type: UPDATE_FIELDS,
    payload: {
      formName,
      changes
    }
  };
};
