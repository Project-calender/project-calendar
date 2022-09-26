import { useLayoutEffect, useState } from 'react';
import { initDateRange } from './useDragDate';
import Moment from '../utils/moment';

export default function useCreateEventBar(selectedDateRange = initDateRange) {
  const [newEventBars, setNewEventBars] = useState([]);

  useLayoutEffect(() => {
    const eventBars = createEventBar(selectedDateRange);
    setNewEventBars(eventBars);
  }, [selectedDateRange]);

  return { newEventBars, setNewEventBars };
}

export function createEventBar(
  dateRange,
  unitWeekDay = 7,
  firstStandardDate = null,
) {
  if (!unitWeekDay) return [];

  let [minDateTime, maxDateTime] = Object.values(dateRange).sort(ASC_NUMBER);
  if (!minDateTime || !maxDateTime) return [];

  const eventBars = [];
  let start = new Moment(new Date(minDateTime));
  const end = new Moment(new Date(maxDateTime));

  let standardDate = new Moment(start.time);
  if (firstStandardDate) {
    while (firstStandardDate.day !== standardDate.day)
      standardDate = standardDate.addDate(1);

    if (start.resetTime().time < standardDate.addDate(-(unitWeekDay - 1)).time)
      start = standardDate.addDate(-(unitWeekDay - 1));
  } else standardDate = start.addDate(unitWeekDay - start.day - 1);

  while (start.time <= end.time) {
    if (standardDate.time >= end.time) {
      eventBars.push({
        time: start.time,
        scale: start.calculateDateDiff(end.time) + 1,
      });
      break;
    }

    eventBars.push({
      time: start.time,
      scale: start.calculateDateDiff(standardDate.time) + 1,
    });
    start = standardDate.addDate(1);
    standardDate = standardDate.addDate(unitWeekDay);
  }

  return eventBars;
}

const ASC_NUMBER = (a, b) => a - b;
