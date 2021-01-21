import { Action } from "redux";

import { Errors } from "../../../utils/forms";

export const INITIALIZE = "FORM__INITIALIZE";
export const UPDATE_FIELDS =  "FORM__UPDATE_FIELDS";
export const SET_ERRORS =  "FORM__SET_ERRORS";

interface InitializeFormAction<T, K extends keyof T> extends Action {
  type: typeof INITIALIZE,
  payload: {
    formName: K;
  }
};

interface UpdateFieldsAction<T, K extends keyof T> extends Action {
  type: typeof UPDATE_FIELDS;
  payload: {
    formName: K;
    changes: Partial<T[K]>;
  }
};

interface SetErrorsAction<T, K extends keyof T> extends Action {
  type: typeof SET_ERRORS;
  payload: {
    formName: K;
    errors: Errors<T[K]>;
  }
};

export type FormsActionTypes<T, K extends keyof T> = InitializeFormAction<T, K> |
                                                     UpdateFieldsAction<T, K> |
                                                     SetErrorsAction<T, K>;

export function initializeForm<T>(formName: keyof T): FormsActionTypes<T, any> {
  return {
    type: INITIALIZE,
    payload: {
      formName
    }
  };
};

export function updateField<T, K extends keyof T>(formName: K, changes: Partial<T[K]>): FormsActionTypes<T, K> {
  return {
    type: UPDATE_FIELDS,
    payload: {
      formName,
      changes
    }
  };
};

export function setErrors<T, K extends keyof T>(formName: K, errors: Errors<T[K]>): FormsActionTypes<T, K> {
  return {
    type: SET_ERRORS,
    payload: {
      formName,
      errors
    }
  };
};
