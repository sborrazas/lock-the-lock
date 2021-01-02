import { CREATE_LOCK, LocksActionTypes } from "./actions";
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
