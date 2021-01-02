import { INITIALIZE, UPDATE_FIELDS, FormsActionTypes } from "./actions";
import { FormsState, Form } from "./types";

export default function <T>(state: FormsState<T>, action: FormsActionTypes<T>): FormsState<T> {
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
    default:
      return state;
  }
};

export const formInitialState = <T>(entity: T): Form<T> => {
  return {
    initialized: false,
    entity
  };
};
