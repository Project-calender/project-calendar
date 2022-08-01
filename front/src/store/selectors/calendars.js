import { createSelector } from '@reduxjs/toolkit';
import { calendarsAdapter } from '../calendars';
import { userIdSelector } from './user';

export const { selectAll: selectAllCalendar, selectById: selectCalendarById } =
  calendarsAdapter.getSelectors(state => state.calendars);

export const myCalendarSelector = createSelector(
  [selectAllCalendar, userIdSelector],
  (calendars, userId) =>
    calendars.filter(
      calendar => calendar.UserId === userId || calendar.OwnerId === userId,
    ),
);

export const otherCalendarSelector = createSelector(
  [selectAllCalendar, userIdSelector],
  (calendars, userId) =>
    calendars.filter(
      calendar => calendar.UserId !== userId && calendar.OwnerId !== userId,
    ),
);

export const calendarSelector = createSelector(
  [state => state, (_, calendarId) => calendarId],
  (state, calendarId) =>
    calendarId ? selectCalendarById(state, calendarId) : null,
);

export const calendarByEventIdSelector = createSelector(
  [state => state, (_, event) => event?.PrivateCalendarId || event?.CalendarId],
  (state, calendarId) => selectCalendarById(state, calendarId),
);

export const calendarByEventIdsSelector = createSelector(
  [
    state => state,
    (_, events) =>
      events.map(event => event?.PrivateCalendarId || event?.CalendarId),
  ],
  (state, calendarIds) =>
    calendarIds.map(calendarId => selectCalendarById(state, calendarId)),
);
