import { useRef } from 'react';

//hook
function useMoveScroll() {
  let element = useRef < HTMLDivElement > null;
  let onMoveToElement = () => {
    element.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return { element, onMoveToElement };
}

export default useMoveScroll;
