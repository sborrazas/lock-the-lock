export const create = (start: number, end: number): Array<number> => {
  const a = [];

  for (var i = start; i < end; i++) {
    a.push(i);
  }

  return a;
};
