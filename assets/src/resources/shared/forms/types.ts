export type Form<T> = {
  initialized: boolean;
  entity: T;
};

export type FormsState<T> = {
  [K in keyof T]: Form<T[K]>
};

type PresenceError = {
  type: "presence"
};

export type Error = PresenceError;

export type Errors<T> = {
  [P in keyof T]?: Array<Error>;
};
