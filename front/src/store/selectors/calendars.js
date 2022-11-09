import { createSelector } from '@reduxjs/toolkit';
import { calendarsAdapter } from '../calendars';
import { checkedCalendarSelector } from './user';

export const { selectAll: selectAllCalendar, selectById: selectCalendarById } =
  calendarsAdapter.getSelectors(state => state.calendars);

export const calendarsByWriteAuthoritySelector = createSelector(
  [selectAllCalendar],
  calendars => calendars.filter(calendar => calendar.authority > 1),
);

export const myCalendarSelector = createSelector(
  [selectAllCalendar],
  calendars => calendars.filter(calendar => calendar.authority > 2),
);

export const otherCalendarSelector = createSelector(
  [selectAllCalendar],
  calendars => calendars.filter(calendar => calendar.authority <= 2),
);

export const calendarSelector = createSelector(
  [state => state, (_, calendarId) => calendarId],
  (state, calendarId) =>
    calendarId ? selectCalendarById(state, calendarId) : null,
);

export const calendarByEventIdSelector = createSelector(
  [state => state, (_, calendarId) => calendarId],
  (state, calendarId) => selectCalendarById(state, calendarId),
);

export const calendarByEventIdsSelector = createSelector(
  [state => state, (_, events) => events.map(event => event?.CalendarId)],
  (state, calendarIds) =>
    calendarIds.map(calendarId => selectCalendarById(state, calendarId)),
);

export const baseCalendarSelector = createSelector(
  [selectAllCalendar, checkedCalendarSelector],
  (calendars, checkedCalendar) =>
    calendars.find(calendar => checkedCalendar.includes(calendar.id)) ||
    calendars[0],
);

export const baseCalendarIndexSelector = createSelector(
  [selectAllCalendar, checkedCalendarSelector],
  (calendars, checkedCalendar) => {
    const index = calendars.findIndex(calendar =>
      checkedCalendar.includes(calendar.id),
    );
    return index === -1 ? 0 : index;
  },
);
