import { Action } from "redux";

import { Lock } from "./types";

import { Errors } from "../../utils/forms";

export const CREATE_LOCK = "LOCKS__CREATE_LOCK";
export const CREATE_LOCK_SUCCESS = "LOCKS__CREATE_LOCK_SUCCESS";
export const CREATE_LOCK_FAILURE = "LOCKS__CREATE_LOCK_FAILURE";

export interface CreateLockAction extends Action {
  type: typeof CREATE_LOCK;
  payload: Lock
};

export interface CreateLockSuccessAction extends Action {
  type: typeof CREATE_LOCK_SUCCESS;
  payload: Lock;
};

export interface CreateLockFailureAction extends Action {
  type: typeof CREATE_LOCK_FAILURE;
  payload: Errors<Lock>;
};

export type LocksActionTypes = CreateLockAction;

export function createLock(lock: Lock): LocksActionTypes {
  return {
    type: CREATE_LOCK,
    payload: lock
  };
};
