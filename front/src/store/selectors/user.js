import { createSelector } from '@reduxjs/toolkit';

export const userIdSelector = state => state.user.id;

export const checkedSelector = state => state.user.checked;

export const checkCalendarSelector = createSelector(
  checkedSelector,
  (_, calendar) => calendar,
  (checked, calendar) => checked.includes(calendar.calendarId),
);
