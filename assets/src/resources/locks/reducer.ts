import {
  LOCK_INITIALIZE,
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
  UserId,
  User,
  LOCK_STATE_UNINITIALIZED,
  LOCK_STATE_INITIALIZED,
  LOCK_STATE_LOADING,
  LOCK_STATE_SUCCESS,
  LOCK_STATE_FAILED
} from "./types";

export type LocksState = Record<LockId, Lock>;

const initialState: LocksState = {};

const findUsername = (userId: UserId, users: Array<User>): User => {
  const user = users.find(({ id }) => id === userId);

  return user || { id: -1, username: "Unknown", number: 0 };
};

const lockReducer = (state: Lock, action: LocksActionTypes): Lock => {
  if (state.state === LOCK_STATE_SUCCESS) {
    switch (action.type) {
      case LOCK_LOCKED:
        return {
          ...state,
          lockedBy: action.payload.lockedBy,
          lockedAt: action.payload.lockedAt,
          logs: [
            {
              user: findUsername(action.payload.lockedBy, state.users),
              message: "acquired the lock"
            },
            ...state.logs
          ]
        };
      case LOCK_UNLOCKED:
        return {
          ...state,
          lockedBy: null,
          lockedAt: null,
          logs: [
            {
              user: findUsername(state.lockedBy || 0, state.users),
              message: "released the lock after 5 seconds"
            },
            ...state.logs
          ]
        };
      case LOCK_TIMEOUT_UPDATED:
        return {
          ...state,
          timeout: action.payload.timeout,
          logs: [
            {
              user: findUsername(action.payload.userId, state.users),
              message: `updated the timeout to ${action.payload.timeout}`
            },
            ...state.logs
          ]
        }
      case LOCK_USER_ADDED:
        const usersAddedUsers = state.users.slice(0);

        usersAddedUsers.push(action.payload);

        return {
          ...state,
          users: usersAddedUsers,
          logs: [
            {
              user: action.payload,
              message: "joined the lock"
            },
            ...state.logs
          ]
        }
      case LOCK_USER_REMOVED:
        return {
          ...state,
          users: state.users.filter(({ id }) => id !== action.payload.id),
          logs: [
            {
              user: findUsername(action.payload.id, state.users),
              message: "left the lock"
            },
            ...state.logs
          ]
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
    case LOCK_INITIALIZE:
      return {
        ...state,
        [action.payload.lockId]: {
          state: LOCK_STATE_INITIALIZED,
          username: action.payload.username
        }
      };
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
          lockedAt: action.payload.lockedAt,
          logs: [
            {
              user: findUsername(action.payload.userId, action.payload.users),
              message: "joined the lock"
            }
          ]
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
