import { useLayoutEffect, useState } from 'react';
import { initDateRange } from './useDragDate';
import Moment from '../utils/moment';

export default function useCreateTimeEventBar(
  selectedDateRange = initDateRange,
) {
  const [newEventBar, setNewEventBar] = useState([]);

  useLayoutEffect(() => {
    const eventBar = { top: calculateEventBarTop(selectedDateRange), left: 0 };
    setNewEventBar(eventBar);
  }, [selectedDateRange]);

  return { newEventBar, setNewEventBar };
}

export function createTimeEventBar(events) {
  return events
    .sort((a, b) => {
      if (a.startTime === b.startTime) return a.endTime - b.endTime;
      return a.startTime - b.startTime;
    })
    .reduce((byDate, event) => {
      const startDate = new Moment(new Date(event.startTime));
      const endDate = new Moment(new Date(event.endTime));

      const key = startDate.resetTime().time;
      byDate[key] = byDate[key] || [];

      const eventBar = {
        event,
        top: calculateEventBarTop({
          standardDateTime: startDate.time,
          endDateTime: endDate.time,
        }),
        left: calculateEventBarLeft(byDate[key], event),
      };
      byDate[key].push(eventBar);

      return byDate;
    }, {});
}

export function calculateEventBarLeft(eventBars, event) {
  for (let i = eventBars.length - 1; i >= 0; i--) {
    if (eventBars[i].event.endTime >= event.startTime) return i + 1;
  }

  return 0;
}

export function calculateEventBarTop(dateRange) {
  let [minDateTime, maxDateTime] = Object.values(dateRange).sort(ASC_NUMBER);
  if (!minDateTime || !maxDateTime) return [];

  const start = new Moment(new Date(minDateTime));
  const end = new Moment(new Date(maxDateTime));

  return (end.hour - start.hour) * 60 + end.minute - start.minute;
}

const ASC_NUMBER = (a, b) => a - b;
