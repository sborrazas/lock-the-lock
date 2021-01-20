export type LockId = string;

export type User = {
};

export type NewLock = {
  username: string;
  timeout: number;
  is_timed: boolean;
};

export const LOCK_STATE_LOADING = "LOADING";
export const LOCK_STATE_SUCCESS = "SUCCESS";
export const LOCK_STATE_FAILED = "FAILED";

type LockLoading = {
  state: typeof LOCK_STATE_LOADING;
};

type LockSuccess = {
  state: typeof LOCK_STATE_SUCCESS;
  users: Array<User>;
  currentUser: User;
  lockedBy: string | null;
  lockedAt: string | null;
  timeout: number | null;
};

type LockFailed = {
  state: typeof LOCK_STATE_FAILED;
  error: string;
};

export type Lock = LockLoading | LockSuccess | LockFailed;
