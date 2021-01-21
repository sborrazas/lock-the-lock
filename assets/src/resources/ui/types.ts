export type NewLock = {
  username: string;
  timeout: number;
  is_timed: boolean;
};

export type LockSettings = {
  username: string;
};

export type UiForms = {
  createLock: NewLock,
  lockSettings: LockSettings
};
