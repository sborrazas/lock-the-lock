import { Action } from "redux";

import { LockSettings, NewLock, LockId, User } from "./types";

import { Errors } from "../../utils/forms";

export const CREATE = "LOCKS__CREATE";
export const CREATE_SUCCESS = "LOCKS__CREATE_SUCCESS";
export const CREATE_FAILURE = "LOCKS__CREATE_FAILURE";

export const LOCK_SUBSCRIBE = "LOCKS__LOCK_SUBSCRIBE";
export const LOCK_SUBSCRIBE_SUCCESS = "LOCKS__LOCK_SUBSCRIBE_SUCCESS";
export const LOCK_SUBSCRIBE_FAILURE = "LOCKS__LOCK_SUBSCRIBE_FAILURE";

export const LOCK_INITIALIZE = "LOCKS__LOCK_INITIALIZE";
export const LOCK_LOCK = "LOCKS__LOCK_LOCK";
export const LOCK_UNLOCK = "LOCKS__LOCK_UNLOCK";
export const LOCK_UPDATE = "LOCKS__LOCK_UPDATE";

export const LOCK_LOCKED = "LOCKS__LOCK_LOCKED";
export const LOCK_UNLOCKED = "LOCKS__LOCK_UNLOCKED";
export const LOCK_UPDATED = "LOCKS__LOCK_UPDATED";
export const LOCK_FAILED = "LOCKS__LOCK_FAILED";
export const LOCK_CRITICALLY_FAILED = "LOCKS__LOCK_CRITICALLY_FAILED";

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

export interface LockInitializeAction extends Action {
  type: typeof LOCK_INITIALIZE;
  payload: {
    lockId: LockId;
    username: string;
  };
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
    lockedBy: number | null;
    lockedAt: string | null;
    timeout: number;
  };
};

export interface LockSubscribeFailureAction extends Action {
  type: typeof LOCK_SUBSCRIBE_FAILURE;
  payload: {
    lockId: LockId;
    errors: Errors<LockSettings>;
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

export interface LockUpdateAction extends Action {
  type: typeof LOCK_UPDATE;
  payload: {
    lockId: LockId;
  };
};

export interface LockLockedAction extends Action {
  type: typeof LOCK_LOCKED;
  payload: {
    lockId: LockId;
    lockedBy: number;
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
    lockedBy: number | null;
    timeout: number;
  };
};

export interface LockFailedAction extends Action {
  type: typeof LOCK_FAILED;
  payload: {
    lockId: LockId;
    error: string;
  };
};

export interface LockCriticallyFailedAction extends Action {
  type: typeof LOCK_CRITICALLY_FAILED;
  payload: {
    lockId: LockId;
    error: string;
  };
};

export type LocksActionTypes = CreateLockAction | CreateLockSuccessAction | CreateLockFailureAction |
    LockInitializeAction | LockSubscribeAction | LockSubscribeSuccessAction |
    LockSubscribeFailureAction | LockUnsubscribeAction |
    LockLockAction | LockUnlockAction | LockUpdateAction | // Sub input
    LockLockedAction | LockUnlockedAction | LockUpdatedAction | LockFailedAction | // Sub output..
    LockCriticallyFailedAction; // Sub output

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

export function lockInitialize(lockId: LockId, username: string): LocksActionTypes {
  return {
    type: LOCK_INITIALIZE,
    payload: {
      lockId,
      username
    }
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
                                     lockedBy: number | null,
                                     lockedAt: string | null,
                                     timeout: number): LocksActionTypes {
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

export function lockSubscribeFailure(lockId: LockId, errors: Errors<LockSettings>): LocksActionTypes {
  return {
    type: LOCK_SUBSCRIBE_FAILURE,
    payload: {
      lockId,
      errors
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

export function lockLocked(lockId: LockId, lockedBy: number, lockedAt: string): LocksActionTypes {
  return {
    type: LOCK_LOCKED,
    payload: {
      lockId,
      lockedBy,
      lockedAt
    }
  };
};

export function lockUnlocked(lockId: LockId): LocksActionTypes {
  return {
    type: LOCK_UNLOCKED,
    payload: {
      lockId
    }
  };
};

export function lockUpdated(lockId: LockId,
                            users: Array<User>,
                            currentUser: User,
                            lockedBy: number | null,
                            timeout: number): LocksActionTypes {
  return {
    type: LOCK_UPDATED,
    payload: {
      lockId,
      users,
      currentUser,
      lockedBy,
      timeout
    }
  };
};

export function lockFailed(lockId: LockId, error: string) {
  return {
    type: LOCK_FAILED,
    payload: {
      lockId,
      error
    }
  };
};

export function lockCriticallyFailed(lockId: LockId, error: string) {
  return {
    type: LOCK_CRITICALLY_FAILED,
    payload: {
      lockId,
      error
    }
  };
};
