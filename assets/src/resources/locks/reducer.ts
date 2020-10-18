import { CREATE_LOCK, LocksActionTypes } from "./actions";

interface LocksState {
  name: string
};

const initialState: LocksState = {
  name: "initial"
};

export default function (state = initialState, action: LocksActionTypes): LocksState {
  switch (action.type) {
    case CREATE_LOCK:
      return {
        ...state,
        name: action.payload
      };
    default:
      return state;
  }
};

export function selectLock(state: LocksState): string {
  return state.name;
}
