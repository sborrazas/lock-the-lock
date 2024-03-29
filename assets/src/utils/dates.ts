export const diffWithNow = (date: string): number => {
  return diff(new Date(), new Date(date));
};

export const diff = (timeA: Date, timeB: Date): number => {
  return Math.floor((timeA.getTime() - timeB.getTime()) / 1000);
};

export const format = (seconds: number): string => {
  return [
    Math.floor(seconds / 60),
    seconds % 60
  ].map(n => n < 10 ? `0${n}` : `${n}`).join(":");
};

export const prettyFormat = (elapsed: number): string => {
  if (elapsed === 0) {
    return "immediately";
  }
  else if (elapsed < 60) {
    return `after ${elapsed} seconds`;
  }
  else {
    return `after ${Math.round(elapsed / 60)} minutes`;
  }
};
