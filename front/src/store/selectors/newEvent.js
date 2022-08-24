import { createSelector } from '@reduxjs/toolkit';

export const newEventSelector = state => state.newEvent;
export const newEventAllDaySelector = state => state.newEvent.allDay;
export const newEventBarsSelector = state => state.newEvent.bars;
export const newEventEmptyBarsSelector = state => state.newEvent.emptyBars;

export const newEventBarByTimeSelector = createSelector(
  [newEventBarsSelector, (_, dateTime) => dateTime],
  (bars, dateTime) => bars.find(({ time }) => dateTime === time),
);

export const newEventEmptyBarByTimeSelector = createSelector(
  [newEventEmptyBarsSelector, (_, dateTime) => dateTime],
  (bars, dateTime) => bars.includes(dateTime),
);
