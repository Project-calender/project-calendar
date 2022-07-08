import { createSelector } from '@reduxjs/toolkit';
import { userIdSelector } from './user';

export const calendarSelector = (_, props) => props.calendar;

export const privateCalendarSelector = state => state.calendars.private;

export const groupCalendarsSelector = state => state.calendars.group;

export const myCalendarsSelector = createSelector(
  groupCalendarsSelector,
  userIdSelector,
  (calendars, userId) =>
    calendars.filter(calendar => calendar.calendarHostId === userId),
);

export const otherCalendarsSelector = createSelector(
  groupCalendarsSelector,
  userIdSelector,
  (calendars, userId) =>
    calendars.filter(calendar => calendar.calendarHostId !== userId),
);
