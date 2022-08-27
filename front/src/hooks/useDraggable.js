import { useCallback, useState } from 'react';
import { throttle } from '../utils/delay';

let position = { x: 0, y: 0, top: 0, left: 0 };

export default function useDraggable(moveElementRef, mouseMoveSpaceRef) {
  const [isMouseDown, setMouseDown] = useState(false);

  const moveElement = useCallback(
    e => {
      if (e.pageY === position.y && e.pageX === position.x) return;
      throttle(() => {
        position = {
          top: position.top + (e.pageY - position.y),
          left: position.left + (e.pageX - position.x),
          x: e.pageX,
          y: e.pageY,
        };

        const $Element = moveElementRef.current;
        $Element.style.top = position.top + 'px';
        $Element.style.left = position.left + 'px';
      }, 100);
    },
    [moveElementRef],
  );

  function readyMoveElement(e) {
    mouseMoveSpaceRef.current.addEventListener('mousemove', moveElement);
    position = {
      x: e.pageX,
      y: e.pageY,
      top: moveElementRef.current.offsetTop,
      left: moveElementRef.current.offsetLeft,
    };
    setMouseDown(true);
  }

  function stopMoveElement() {
    mouseMoveSpaceRef.current.removeEventListener('mousemove', moveElement);
    setTimeout(() => {
      setMouseDown(false);
    }, 100);
  }

  return { readyMoveElement, stopMoveElement, isMouseDown };
}
