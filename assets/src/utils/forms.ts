export type Form<T> = {
  initialized: boolean;
  entity: T;
};

export const formInit = <T>(entity: T): Form<T> => {
  return {
    initialized: false,
    entity
  };
};
