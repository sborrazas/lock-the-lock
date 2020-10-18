import { Action } from "redux";

export const CREATE_LOCK =  "CREATE_LOCK";

export type Name = string;

interface CreateLockAction extends Action {
  type: typeof CREATE_LOCK
  payload: Name
};

export type LocksActionTypes = CreateLockAction;

export function createLock(name: Name): LocksActionTypes {
  return {
    type: CREATE_LOCK,
    payload: name
  };
};
