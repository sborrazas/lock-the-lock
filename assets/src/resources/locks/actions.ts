import { Action } from "redux";

export const CREATE_LOCK =  "LOCKS__CREATE_LOCK";

export type Lock = {
  username: string;
  timeout: string;
  is_timed: boolean;
};

interface CreateLockAction extends Action {
  type: typeof CREATE_LOCK;
  payload: Lock
};

export type LocksActionTypes = CreateLockAction;

export function createLock(lock: Lock): LocksActionTypes {
  return {
    type: CREATE_LOCK,
    payload: lock
  };
};
