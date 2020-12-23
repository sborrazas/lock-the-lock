import { UiActionTypes } from "./actions";
import { UiForms } from "./types";
import formsReducer, { Form, FormsState, formInitialState } from "../shared/forms/reducer";

interface UiState {
  forms: FormsState<UiForms>
};

const initialState: UiState = {
  forms: {
    createLock: formInitialState({ username: "", timeout: "" })
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

export function selectForm<K extends keyof UiForms>(state: UiState, name: K): Form<UiForms[K]> {
  return state.forms[name];
};
