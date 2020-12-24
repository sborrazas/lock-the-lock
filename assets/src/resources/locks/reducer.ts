import { CREATE_LOCK, LocksActionTypes, Lock } from "./actions";

interface LocksState {
};

const initialState: LocksState = {
};

export default function (state = initialState, action: LocksActionTypes): LocksState {
  switch (action.type) {
    default:
      return state;
  }
};
