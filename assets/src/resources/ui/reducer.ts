import { UiActionTypes } from "./actions";
import { UiForms } from "./types";
import formsReducer, { formInitialState, FormsState } from "../shared/forms/reducer";

export interface UiState {
  forms: FormsState<UiForms>
};

const initialState: UiState = {
  forms: {
    createLock: formInitialState({ username: "", timeout: 60, is_timed: false }),
    lockSettings: formInitialState({ username: "" })
  }
};

export default function (state: UiState = initialState, action: UiActionTypes): UiState {
  switch (action.type) {
    default:
      return {
        ...state,
        forms: formsReducer(state.forms, action)
      };
  }
};

export function selectForm<K extends keyof UiForms>(state: UiState, name: K): UiState["forms"][K] {
  return state.forms[name];
};
