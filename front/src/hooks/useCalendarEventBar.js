import { useLayoutEffect, useState } from 'react';
import { debounce } from '../utils/delay';
import Moment from '../utils/moment';

export default function useCalendarEventBar() {
  const [isMouseUp, toggleMouseUp] = useState(false);
  const [selectedDateRange, changeDateRange] = useState({
    standardDate: 0,
    endDate: 0,
  });
  const [eventbars, setEventBars] = useState([]);

  useLayoutEffect(() => {
    let [minTime, maxTime] = Object.values(selectedDateRange).sort(
      (a, b) => a - b,
    );

    const events = [];
    let start = new Moment(new Date(minTime));
    while (start.time <= maxTime) {
      const end = start.addDate(6 - start.day);
      if (end.time >= maxTime) {
        events.push({
          time: start.time,
          scale: new Moment(new Date(maxTime)).day - start.day + 1,
        });
        break;
      }

      events.push({ time: start.time, scale: 6 - start.day + 1 });
      start = end.addDate(1);
    }

    setEventBars(events);
  }, [selectedDateRange]);

  function createEventBar(e) {
    const dateId = +e.target.dataset.dateId;
    if (!dateId) return;
    changeDateRange({ standardDate: dateId, endDate: dateId });
    toggleMouseUp(true);
  }

  function removeEventBar() {
    toggleMouseUp(false);
  }

  function handleDragEvent(e) {
    const dateId = +e.target.dataset.dateId;
    if (!dateId) return;

    debounce(() => {
      changeDateRange(dates => ({ ...dates, endDate: dateId }));
    }, 200);
  }

  return {
    createEventBar,
    removeEventBar,
    handleDragEvent,
    isMouseUp,
    eventbars,
  };
}
