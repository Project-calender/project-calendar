let timer = null;

export function throttle(callback, time) {
  if (!timer) {
    timer = setTimeout(() => {
      timer = null;
      callback();
    }, time);
  }
}

export function debounce(callback, time) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => callback(), time);
}
