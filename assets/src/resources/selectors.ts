import { RootState } from "./reducer";
import { selectLock } from "./locks/reducer";

const locks = {
  selectLock: (state: RootState) => selectLock(state.locks)
};

export {
  locks
};
