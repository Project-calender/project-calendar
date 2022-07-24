import { useLayoutEffect, useState } from 'react';
import { initDateRange } from './useDragDate';
import Moment from '../utils/moment';

export default function useMonthEventBar(selectedDateRange = initDateRange) {
  const [newEventBars, setNewEventBars] = useState([]);

  useLayoutEffect(() => {
    const eventBars = createEventBar(selectedDateRange);
    setNewEventBars(eventBars);
  }, [selectedDateRange]);

  return { newEventBars, setNewEventBars };
}

export function createEventBar(dateRange) {
  let [minDateTime, maxDateTime] = Object.values(dateRange).sort(ASC_NUMBER);

  const eventBars = [];
  let start = new Moment(new Date(minDateTime));
  const end = new Moment(new Date(maxDateTime));

  while (start.time <= end.time) {
    const saturday = start.addDate(6 - start.day);

    if (saturday.time >= end.time) {
      eventBars.push({
        time: start.time,
        scale: end.day - start.day + 1,
      });
      break;
    }

    eventBars.push({ time: start.time, scale: saturday.day - start.day + 1 });
    start = saturday.addDate(1);
  }

  return eventBars;
}

const ASC_NUMBER = (a, b) => a - b;
