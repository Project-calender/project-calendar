import { createSelector } from '@reduxjs/toolkit';

export const newEventSelector = state => state.newEvent;
export const newEventBarsSelector = state => state.newEvent.bars;

export const newEventBarByTimeSelector = createSelector(
  [newEventBarsSelector, (_, dateTime) => dateTime],
  (bars, dateTime) => bars.find(({ time }) => dateTime === time),
);
