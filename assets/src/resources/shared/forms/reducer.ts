import { INITIALIZE, UPDATE_FIELDS, SET_ERRORS, FormsActionTypes } from "./actions";
import { Form } from "../../../utils/forms";

export type FormsState<T> = {
  [K in keyof T]: Form<T[K]>
};

export default function <T, K extends keyof T>(state: FormsState<T>, action: FormsActionTypes<T, K>): FormsState<T> {
  switch (action.type) {
    case INITIALIZE:
      return {
        ...state,
        [action.payload.formName]: {
          ...state[action.payload.formName],
          initialized: true
        }
      };
    case UPDATE_FIELDS:
      return {
        ...state,
        [action.payload.formName]: {
          ...state[action.payload.formName],
          entity: {
            ...state[action.payload.formName].entity,
            ...action.payload.changes
          }
        }
      };
    case SET_ERRORS:
      return {
        ...state,
        [action.payload.formName]: {
          ...state[action.payload.formName],
          errors: action.payload.errors
        }
      };
    default:
      return state;
  }
};

export const formInitialState = <T>(entity: T): Form<T> => {
  return {
    initialized: false,
    entity,
    errors: {}
  };
};
