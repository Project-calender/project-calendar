let timer = null;

export function throttle(event, time) {
  if (!timer) {
    timer = setTimeout(() => {
      timer = null;
      event();
    }, time);
  }
}

export function debounce(event, time) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    event();
  }, time);
}
