import { Action } from "redux";

import { NewLock, LockId, User } from "./types";

import { Errors } from "../../utils/forms";

export const CREATE = "LOCKS__CREATE";
export const CREATE_SUCCESS = "LOCKS__CREATE_SUCCESS";
export const CREATE_FAILURE = "LOCKS__CREATE_FAILURE";

export const LOCK_SUBSCRIBE = "LOCKS__LOCK_SUBSCRIBE";
export const LOCK_SUBSCRIBE_SUCCESS = "LOCKS__LOCK_SUBSCRIBE_SUCCESS";
export const LOCK_SUBSCRIBE_FAILURE = "LOCKS__LOCK_SUBSCRIBE_FAILURE";

export const LOCK_LOCK = "LOCKS__LOCK_LOCK";
export const LOCK_UNLOCK = "LOCKS__LOCK_UNLOCK";
export const LOCK_LOCKED = "LOCKS__LOCK_LOCKED";
export const LOCK_UNLOCKED = "LOCKS__LOCK_UNLOCKED";
export const LOCK_UPDATED = "LOCKS__LOCK_UPDATED";

export const LOCK_UNSUBSCRIBE = "LOCKS__LOCK_UNSUBSCRIBE";

export interface CreateLockAction extends Action {
  type: typeof CREATE;
  payload: NewLock
};

export interface CreateLockSuccessAction extends Action {
  type: typeof CREATE_SUCCESS;
  payload: LockId;
};

export interface CreateLockFailureAction extends Action {
  type: typeof CREATE_FAILURE;
  payload: Errors<NewLock>;
};

export interface LockSubscribeAction extends Action {
  type: typeof LOCK_SUBSCRIBE;
  payload: {
    lockId: LockId;
    username: string;
  };
};

export interface LockSubscribeSuccessAction extends Action {
  type: typeof LOCK_SUBSCRIBE_SUCCESS;
  payload: {
    lockId: LockId;
    users: Array<User>;
    currentUser: User;
    lockedBy: string | null;
    lockedAt: string | null;
    timeout: number | null;
  };
};

export interface LockSubscribeFailureAction extends Action {
  type: typeof LOCK_SUBSCRIBE_FAILURE;
  payload: {
    lockId: LockId;
    error: string;
  };
};

export interface LockUnsubscribeAction extends Action {
  type: typeof LOCK_UNSUBSCRIBE;
  payload: {
    lockId: LockId;
  };
};

export interface LockLockAction extends Action {
  type: typeof LOCK_LOCK;
  payload: {
    lockId: LockId;
  };
};

export interface LockUnlockAction extends Action {
  type: typeof LOCK_UNLOCK;
  payload: {
    lockId: LockId;
  };
};

export interface LockLockedAction extends Action {
  type: typeof LOCK_LOCKED;
  payload: {
    lockId: LockId;
    lockedBy: string;
    lockedAt: string;
  };
};

export interface LockUnlockedAction extends Action {
  type: typeof LOCK_UNLOCKED;
  payload: {
    lockId: LockId;
  };
};

export interface LockUpdatedAction extends Action {
  type: typeof LOCK_UPDATED;
  payload: {
    lockId: LockId;
    users: Array<User>;
    currentUser: User;
    lockedBy: string | null;
    lockedAt: string | null;
    timeout: number | null;
  };
};

export type LocksActionTypes = CreateLockAction | CreateLockSuccessAction | CreateLockFailureAction |
    LockSubscribeAction | LockSubscribeSuccessAction | LockSubscribeFailureAction | LockUnsubscribeAction |
    LockLockAction | LockUnlockAction | LockLockedAction | LockUnlockedAction | LockUpdatedAction;

export function createLock(newLock: NewLock): LocksActionTypes {
  return {
    type: CREATE,
    payload: newLock
  };
};

export function createLockSuccess(lockId: LockId): LocksActionTypes {
  return {
    type: CREATE_SUCCESS,
    payload: lockId
  };
};

export function createLockFailure(errors: Errors<NewLock>): LocksActionTypes {
  return {
    type: CREATE_FAILURE,
    payload: errors
  };
};

export function lockSubscribe(lockId: LockId, username: string): LocksActionTypes {
  return {
    type: LOCK_SUBSCRIBE,
    payload: {
      lockId,
      username
    }
  };
};

export function lockSubscribeSuccess(lockId: LockId,
                                     users: Array<User>,
                                     currentUser: User,
                                     lockedBy: string | null,
                                     lockedAt: string | null,
                                     timeout: number | null): LocksActionTypes {
  return {
    type: LOCK_SUBSCRIBE_SUCCESS,
    payload: {
      lockId,
      users,
      currentUser,
      lockedBy,
      lockedAt,
      timeout
    }
  };
};

export function lockSubscribeFailure(lockId: LockId, error: string): LocksActionTypes {
  return {
    type: LOCK_SUBSCRIBE_FAILURE,
    payload: {
      lockId,
      error
    }
  };
};

export function lockUnsubscribe(lockId: LockId): LocksActionTypes {
  return {
    type: LOCK_UNSUBSCRIBE,
    payload: {
      lockId
    }
  };
};
