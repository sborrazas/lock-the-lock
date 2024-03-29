import { Action } from "redux";

import { LockSettings, NewLock, LockId, User, UserId } from "./types";

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
export const LOCK_UPDATE_TIMEOUT = "LOCKS__LOCK_UPDATE_TIMEOUT";

export const LOCK_LOCKED = "LOCKS__LOCK_LOCKED";
export const LOCK_UNLOCKED = "LOCKS__LOCK_UNLOCKED";
export const LOCK_TIMEDOUT = "LOCKS__LOCK_TIMEDOUT";
export const LOCK_USER_ADDED = "LOCKS__LOCK_USER_ADDED";
export const LOCK_USER_REMOVED = "LOCKS__LOCK_USER_REMOVED";
export const LOCK_TIMEOUT_UPDATED = "LOCKS__LOCK_TIMEOUT_UPDATED";
export const LOCK_FAILED = "LOCKS__LOCK_FAILED";
export const LOCK_CRITICALLY_FAILED = "LOCKS__LOCK_CRITICALLY_FAILED";

export const LOCK_UNSUBSCRIBE = "LOCKS__LOCK_UNSUBSCRIBE";

export interface CreateLockAction extends Action {
  type: typeof CREATE;
  payload: NewLock;
};

export interface CreateLockSuccessAction extends Action {
  type: typeof CREATE_SUCCESS;
  payload: {
    lockId: LockId;
    username: string;
  }
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
    userId: UserId;
    users: Array<User>;
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

export interface LockUpdateTimeoutAction extends Action {
  type: typeof LOCK_UPDATE_TIMEOUT;
  payload: {
    lockId: LockId;
    timeout: number;
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

export interface LockTimedoutAction extends Action {
  type: typeof LOCK_TIMEDOUT;
  payload: {
    lockId: LockId;
  };
};

export interface LockUserAddedAction extends Action {
  type: typeof LOCK_USER_ADDED;
  payload: {
    lockId: LockId;
    id: UserId;
    username: string;
    number: number;
  };
};

export interface LockUserRemovedAction extends Action {
  type: typeof LOCK_USER_REMOVED;
  payload: {
    lockId: LockId;
    id: UserId;
  };
};

export interface LockTimeoutUpdatedAction extends Action {
  type: typeof LOCK_TIMEOUT_UPDATED;
  payload: {
    lockId: LockId;
    userId: UserId;
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
    LockLockAction | LockUnlockAction | LockUpdateTimeoutAction | // Sub input
    LockLockedAction | LockUnlockedAction | LockTimedoutAction | // Sub output..
    LockTimeoutUpdatedAction | LockFailedAction | LockUserAddedAction | // Sub output..
    LockUserRemovedAction | LockCriticallyFailedAction; // Sub output

export function createLock(newLock: NewLock): LocksActionTypes {
  return {
    type: CREATE,
    payload: newLock
  };
};

export function createLockSuccess(lockId: LockId, username: string): LocksActionTypes {
  return {
    type: CREATE_SUCCESS,
    payload: {
      lockId,
      username
    }
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
                                     userId: UserId,
                                     lockedBy: number | null,
                                     lockedAt: string | null,
                                     timeout: number): LocksActionTypes {
  return {
    type: LOCK_SUBSCRIBE_SUCCESS,
    payload: {
      lockId,
      userId,
      users,
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

export function lockLock(lockId: LockId): LocksActionTypes {
  return {
    type: LOCK_LOCK,
    payload: {
      lockId
    }
  };
};

export function lockUnlock(lockId: LockId): LocksActionTypes {
  return {
    type: LOCK_UNLOCK,
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

export function lockTimedout(lockId: LockId): LocksActionTypes {
  return {
    type: LOCK_TIMEDOUT,
    payload: {
      lockId
    }
  };
};

export function lockTimeoutUpdated(lockId: LockId, userId: UserId, timeout: number): LocksActionTypes {
  return {
    type: LOCK_TIMEOUT_UPDATED,
    payload: {
      lockId,
      userId,
      timeout
    }
  };
};

export function lockUserAdded(lockId: LockId, id: UserId, username: string, number: number): LocksActionTypes {
  return {
    type: LOCK_USER_ADDED,
    payload: {
      lockId,
      id,
      username,
      number
    }
  };
};

export function lockUserRemoved(lockId: LockId, id: UserId): LocksActionTypes {
  return {
    type: LOCK_USER_REMOVED,
    payload: {
      lockId,
      id
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
