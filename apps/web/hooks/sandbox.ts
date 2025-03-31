export function useSandbox<T>(dependencies = {}) {
  const sandboxContext = {
    ...dependencies,
  };

  return (userCode: string): T | undefined => {
    try {
      const userFunction = new Function(
        ...Object.keys(sandboxContext),
        `
        "use strict";
        return (${userCode});
        `
      );

      return userFunction(...Object.values(sandboxContext));
    } catch {
      return;
    }
  };
}