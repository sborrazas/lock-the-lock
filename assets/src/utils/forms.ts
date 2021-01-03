type PresenceError = {
  type: "presence"
};

export type FError = PresenceError;

export type Errors<T> = {
  [P in keyof T]?: Array<FError>;
};

export type Form<T> = {
  initialized: boolean;
  entity: T;
  errors: Errors<T>;
};

export const formInit = <T>(entity: T): Form<T> => {
  return {
    initialized: false,
    entity,
    errors: {}
  };
};
