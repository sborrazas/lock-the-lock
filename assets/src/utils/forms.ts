type PresenceError = {
  type: "presence",
};

type UniqueError = {
  type: "unique";
};

type LengthError = {
  type: "length";
};

export type FError = (PresenceError | UniqueError | LengthError) & { message: string; };

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
