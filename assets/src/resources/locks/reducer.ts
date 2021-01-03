import { CREATE_LOCK, CREATE_LOCK_SUCCESS, CREATE_LOCK_FAILURE, LocksActionTypes } from "./actions";
import { Lock } from "./types";

export interface LocksState {
};

const initialState: LocksState = {
};

export default function (state = initialState, action: LocksActionTypes): LocksState {
  switch (action.type) {
    default:
      return state;
  }
};
