import { createSelector } from '@reduxjs/toolkit';
import { userIdSelector } from './user';

export const calendarSelector = (_, props) => props.calendar;

export const calendarsSelector = state => state.calendars;

export const myCalendarsSelector = createSelector(
  calendarsSelector,
  userIdSelector,
  (calendars, userId) =>
    calendars.filter(calendar => calendar.calendarHostId === userId),
);

export const otherCalendarsSelector = createSelector(
  calendarsSelector,
  userIdSelector,
  (calendars, userId) =>
    calendars.filter(calendar => calendar.calendarHostId !== userId),
);
