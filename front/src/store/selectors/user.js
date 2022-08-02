import { createSelector } from '@reduxjs/toolkit';

export const userIdSelector = state => state.user.id;

export const checkedCalendarSelector = createSelector(
  state => state.user.checkedCalendar,
  (_, calendar) => calendar,
  (checkedCalendar, calendar) => checkedCalendar.includes(calendar?.id),
);
