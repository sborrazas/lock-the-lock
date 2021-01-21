import { RootState } from "./reducer";

import { UiForms } from "./ui/types";
import { selectForm } from "./ui/reducer";

import { LockId } from "./locks/types";
import { selectLock } from "./locks/reducer";

const locks = {
  selectLock: (state: RootState, lockId: LockId) => selectLock(state.locks, lockId)
};

const ui = {
  selectForm: <K extends keyof UiForms>(state: RootState, name: K) => selectForm(state.ui, name)
};

export {
  locks,
  ui
};
