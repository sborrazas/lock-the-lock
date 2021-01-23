import {
  LOCK_SUBSCRIBE,
  LOCK_SUBSCRIBE_SUCCESS,
  LOCK_SUBSCRIBE_FAILURE,
  LOCK_LOCK,
  LOCK_UNLOCK,
  LOCK_LOCKED,
  LOCK_UNLOCKED,
  LOCK_USER_ADDED,
  LOCK_USER_REMOVED,
  LOCK_TIMEOUT_UPDATED,
  LocksActionTypes
} from "./actions";

import {
  Lock,
  LockId,
  LOCK_STATE_UNINITIALIZED,
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
      case LOCK_TIMEOUT_UPDATED:
        return {
          ...state,
          timeout: action.payload.timeout
        }
      case LOCK_USER_ADDED:
        const usersAddedUsers = state.users.slice(0);

        usersAddedUsers.push(action.payload);

        return {
          ...state,
          users: usersAddedUsers
        }
      case LOCK_USER_REMOVED:
        return {
          ...state,
          users: state.users.filter(({ id }) => id === action.payload.id)
        }
      default:
        return state;
    }
  }
  else {
    return state;
  }
};

export default function (state = initialState, action: LocksActionTypes): LocksState {
  console.log("ACTION", action);
  switch (action.type) {
    case LOCK_SUBSCRIBE:
      return {
        ...state,
        [action.payload.lockId]: {
          state: LOCK_STATE_LOADING
        }
      };
    case LOCK_SUBSCRIBE_SUCCESS:
      return {
        ...state,
        [action.payload.lockId]: {
          state: LOCK_STATE_SUCCESS,
          timeout: action.payload.timeout,
          users: action.payload.users,
          userId: action.payload.userId,
          lockedBy: action.payload.lockedBy,
          lockedAt: action.payload.lockedAt
        }
      };
    case LOCK_SUBSCRIBE_FAILURE:
      if (state[action.payload.lockId].state === LOCK_STATE_LOADING) {
        return {
          ...state,
          [action.payload.lockId]: {
            state: LOCK_STATE_FAILED,
            errors: action.payload.errors
          }
        };
      }
      else {
        return state;
      }
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
    case LOCK_TIMEOUT_UPDATED:
      return {
        ...state,
        [action.payload.lockId]: lockReducer(state[action.payload.lockId], action)
      };
    case LOCK_USER_ADDED:
      return {
        ...state,
        [action.payload.lockId]: lockReducer(state[action.payload.lockId], action)
      };
    case LOCK_USER_REMOVED:
      return {
        ...state,
        [action.payload.lockId]: lockReducer(state[action.payload.lockId], action)
      };
    default:
      return state;
  }
};

export function selectLock(state: LocksState, lockId: LockId): Lock {
  return state[lockId] || { state: LOCK_STATE_UNINITIALIZED };
};
