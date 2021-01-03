import { UiActionTypes } from "./actions";
import { UiForms } from "./types";
import formsReducer, { formInitialState, FormsState } from "../shared/forms/reducer";
import { Form } from "../../utils/forms";

export interface UiState {
  forms: FormsState<UiForms>
};

const initialState: UiState = {
  forms: {
    createLock: formInitialState({ username: "", timeout: 60, is_timed: false })
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
