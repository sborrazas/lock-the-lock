import { INITIALIZE, UPDATE_FIELDS, FormsActionTypes } from "./actions";

export type Form<T> = {
  initialized: boolean;
  entity: T;
};

export type FormsState<T> = {
  [K in keyof T]: Form<T[K]>
};

export default function <T>(state: FormsState<T>, action: FormsActionTypes<T>): FormsState<T> {
  switch (action.type) {
    case INITIALIZE:
      return {
        ...state
      };
    case UPDATE_FIELDS:
      return {
        ...state
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
