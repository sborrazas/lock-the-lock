export const cssClasses = (classesObj: Record<string, boolean>): string => {
    return Object.entries(classesObj)
        .filter(([_className, isEnabled]) => isEnabled)
        .map(([className, _isEnabled]) => className)
        .join(" ");
};
