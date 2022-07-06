import { useLayoutEffect, useState } from 'react';
import Moment from '../utils/moment';
import { initDateRange } from './useDragDate';

export default function useMonthEventBar(selectedDateRange = initDateRange) {
  const [monthEventBars, setMonthEventBars] = useState([]);

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

    setMonthEventBars(events);
  }, [selectedDateRange]);

  return { monthEventBars };
}
