export const throttle = (function () {
  let timer = null;
  return (callback, time) => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        callback();
      }, time);
    }
  };
})();

export const debounce = (function () {
  let timer = null;
  return (callback, time) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback(), time);
  };
})();
