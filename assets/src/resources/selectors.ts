import { RootState } from "./reducer";
import { UiForms } from "./ui/types";
import { selectForm } from "./ui/reducer";

const locks = {};

const ui = {
  selectForm: (state: RootState, name: keyof UiForms) => selectForm(state.ui, name)
};

export {
  locks,
  ui
};
