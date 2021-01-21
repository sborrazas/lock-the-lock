export type LockId = string;

export type User = {
  username: string;
  id: number;
  colorNumber: number;
};

export const LOCK_STATE_UNINITIALIZED = "UNINITIALIZED";
export const LOCK_STATE_INITIALIZED = "INITIALIZED";
export const LOCK_STATE_LOADING = "LOADING";
export const LOCK_STATE_SUCCESS = "SUCCESS";
export const LOCK_STATE_FAILED = "FAILED";

type BaseLock = {
  currentUser: User;
};

type LockUninitialized = {
  state: typeof LOCK_STATE_UNINITIALIZED;
};

type LockInitialized = BaseLock & {
  state: typeof LOCK_STATE_INITIALIZED;
};

type LockLoading = BaseLock & {
  state: typeof LOCK_STATE_LOADING;
};

type LockSuccess = BaseLock & {
  state: typeof LOCK_STATE_SUCCESS;
  users: Array<User>;
  lockedBy: number | null;
  lockedAt: string | null;
  timeout: number;
};

type LockFailed = BaseLock & {
  state: typeof LOCK_STATE_FAILED;
  error: string;
};

export type Lock = LockUninitialized | LockInitialized | LockLoading | LockSuccess | LockFailed;
