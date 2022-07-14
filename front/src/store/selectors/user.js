import { createSelector } from '@reduxjs/toolkit';
import { getCalendarCheckId } from '../calendars';

export const userIdSelector = state => state.user.id;

export const checkedCalendarSelector = createSelector(
  state => state.user.checkedCalendar,
  (_, calendar) => calendar,
  (checkedCalendar, calendar) =>
    checkedCalendar.includes(getCalendarCheckId(calendar)),
);
