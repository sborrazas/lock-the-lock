import {
  LOCK_SUBSCRIBE,
  LOCK_SUBSCRIBE_SUCCESS,
  LOCK_SUBSCRIBE_FAILURE,
  LOCK_LOCK,
  LOCK_UNLOCK,
  LOCK_LOCKED,
  LOCK_UNLOCKED,
  LOCK_UPDATED,
  LocksActionTypes
} from "./actions";

import {
  Lock,
  LockId,
  LOCK_STATE_LOADING,
  LOCK_STATE_SUCCESS,
  LOCK_STATE_FAILED
} from "./types";

export type LocksState = Record<LockId, Lock>;

const initialState: LocksState = {};

const lockReducer = (state: Lock, action: LocksActionTypes): Lock => {
  if (state.state === LOCK_STATE_SUCCESS) {
    switch (action.type) {
      case LOCK_LOCKED:
        return {
          ...state,
          lockedBy: action.payload.lockedBy,
          lockedAt: action.payload.lockedAt
        };
      case LOCK_UNLOCKED:
        return {
          ...state,
          lockedBy: null,
          lockedAt: null
        };
      case LOCK_UPDATED:
        return {
          ...state,
          timeout: action.payload.timeout,
          users: action.payload.users,
          currentUser: action.payload.currentUser,
          lockedBy: action.payload.lockedBy
        }
      case LOCK_SUBSCRIBE_FAILURE:
        return {
          ...state,
          [action.payload.lockId]: {
            ...state,
            state: LOCK_STATE_FAILED,
            errors: action.payload.errors
          }
        };
      default:
        return state;
    }
  }
  else {
    return state;
  }
};

export default function (state = initialState, action: LocksActionTypes): LocksState {
  switch (action.type) {
    case LOCK_SUBSCRIBE:
      return {
        ...state,
        [action.payload.lockId]: {
          ...state[action.payload.lockId],
          state: LOCK_STATE_LOADING,
          username: action.payload.username
        }
      };
    case LOCK_SUBSCRIBE_SUCCESS:
      return {
        ...state,
        [action.payload.lockId]: {
          state: LOCK_STATE_SUCCESS,
          timeout: action.payload.timeout,
          users: action.payload.users,
          currentUser: action.payload.currentUser,
          lockedBy: action.payload.lockedBy,
          lockedAt: action.payload.lockedAt
        }
      };
    case LOCK_SUBSCRIBE_FAILURE:
      return {
        ...state,
        [action.payload.lockId]: lockReducer(state[action.payload.lockId], action)
      };
    case LOCK_LOCK:
      return {
        ...state
      };
    case LOCK_UNLOCK:
      return {
        ...state
      };
    case LOCK_LOCKED:
      return {
        ...state,
        [action.payload.lockId]: lockReducer(state[action.payload.lockId], action)
      };
    case LOCK_UNLOCKED:
      return {
        ...state,
        [action.payload.lockId]: lockReducer(state[action.payload.lockId], action)
      };
    case LOCK_UPDATED:
      return {
        ...state,
        [action.payload.lockId]: lockReducer(state[action.payload.lockId], action)
      };
    default:
      return state;
  }
};

export function selectLock(state: LocksState, lockId: LockId): Lock {
  return state[lockId];
};
