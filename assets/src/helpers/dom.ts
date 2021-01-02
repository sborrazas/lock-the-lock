export const isInside = (el: HTMLElement, container: HTMLElement): boolean => {
  if (el === container) {
    return true;
  }
  else if (el.parentElement) {
    return isInside(el.parentElement, container);
  }
  else {
    return false;
  }
};
