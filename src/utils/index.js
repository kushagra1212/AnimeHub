export const throttleFunc = (func, interval) => {
  let prevDate = Date.now();
  return function (...args) {
    if (Date.now() - prevDate >= interval) {
      func(args);
      prevDate = Date.now();
    }
  };
};
