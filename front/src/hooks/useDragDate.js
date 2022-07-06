import { useState } from 'react';
import { debounce } from '../utils/delay';

export const initDateRange = { standardDateTime: 0, endDateTime: 0 };
export const eventTarget = e => +e.target.dataset.dateId;

export default function useDragDate() {
  const [isMouseDown, toggleMouseDown] = useState(false);
  const [selectedDateRange, changeDateRange] = useState(initDateRange);

  function handleMouseDown(e) {
    const dateId = eventTarget(e);
    if (!dateId) return;

    changeDateRange({ standardDateTime: dateId, endDateTime: dateId });
    toggleMouseDown(true);
  }

  function handleMouseUp() {
    toggleMouseDown(false);
  }

  function handleDrag(e) {
    const dateId = eventTarget(e);
    if (!dateId) return;

    debounce(
      () => changeDateRange(range => ({ ...range, endDateTime: dateId })),
      200,
    );
  }

  return {
    handleMouseDown,
    handleMouseUp,
    handleDrag,
    isMouseDown,
    selectedDateRange,
  };
}
