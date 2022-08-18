import { useState } from 'react';
import { debounce } from '../utils/delay';

export const initDateRange = { standardDateTime: 0, endDateTime: 0 };
export const eventTarget = e => +e.target.dataset.dragDate;

export default function useDragDate() {
  const [isMouseDown, toggleMouseDown] = useState(false);
  const [selectedDateRange, changeDateRange] = useState(initDateRange);

  function handleMouseDown(e) {
    const dateId = eventTarget(e);
    if (!dateId || e.button === 2) return;

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
      () =>
        changeDateRange(range =>
          dateId === range.endDateTime
            ? range
            : { ...range, endDateTime: dateId },
        ),
      100,
    );
  }

  return {
    handleMouseDown,
    handleMouseUp,
    handleDrag,
    isMouseDown,
    selectedDateRange,
    changeDateRange,
  };
}
