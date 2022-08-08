import { createSelector } from '@reduxjs/toolkit';

export const userIdSelector = state => state.user.id;
export const userEmailSelector = state => state.user.email;
export const checkedCalendarSelector = state => state.user.checkedCalendar;

export const isCheckedCalendarSelector = createSelector(
  state => state.user.checkedCalendar,
  (_, calendar) => calendar,
  (checkedCalendar, calendar) => checkedCalendar.includes(calendar?.id),
);
