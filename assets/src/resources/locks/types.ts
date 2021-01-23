import { Errors } from "../../utils/forms";

export type LockId = string;

export type UserId = number;

export type User = {
  id: UserId;
  username: string;
  number: number;
};

export const LOCK_STATE_UNINITIALIZED = "UNINITIALIZED";
export const LOCK_STATE_INITIALIZED = "INITIALIZED";
export const LOCK_STATE_LOADING = "LOADING";
export const LOCK_STATE_SUCCESS = "SUCCESS";
export const LOCK_STATE_FAILED = "FAILED";

type BaseLock = {
  userId: UserId;
};

type LockUninitialized = {
  state: typeof LOCK_STATE_UNINITIALIZED;
};

type LockInitialized = {
  state: typeof LOCK_STATE_INITIALIZED;
  username: string;
};

type LockLoading = {
  state: typeof LOCK_STATE_LOADING;
};

type LockSuccess = BaseLock & {
  state: typeof LOCK_STATE_SUCCESS;
  users: Array<User>;
  lockedBy: number | null;
  lockedAt: string | null;
  timeout: number;
};

type LockFailed = {
  state: typeof LOCK_STATE_FAILED;
  errors: Errors<LockSettings>;
};

export type Lock = LockUninitialized | LockInitialized | LockLoading | LockSuccess | LockFailed;

// Forms
export type NewLock = {
  username: string;
  timeout: number;
  is_timed: boolean;
};

export type LockSettings = {
  username: string;
};
