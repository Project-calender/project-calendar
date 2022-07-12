import { createSelector } from '@reduxjs/toolkit';
import { selectCalendars } from '../calendars';
import { userIdSelector } from './user';

export const myCalendarSelector = createSelector(
  [selectCalendars, userIdSelector],
  (calendars, userId) =>
    calendars.filter(
      calendar => calendar.UserId === userId || calendar.OwnerId === userId,
    ),
);

export const otherCalendarSelector = createSelector(
  [selectCalendars, userIdSelector],
  (calendars, userId) =>
    calendars.filter(
      calendar => calendar.UserId !== userId && calendar.OwnerId !== userId,
    ),
);
