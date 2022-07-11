import { createSelector } from '@reduxjs/toolkit';
import { userIdSelector } from './user';

export const calendarsSelector = state => state.calendars;

export const myCalendarsSelector = createSelector(
  calendarsSelector,
  userIdSelector,
  (calendars, userId) =>
    calendars.filter(
      calendar => calendar.userId === userId || calendar.ownerId === userId,
    ),
);

export const otherCalendarsSelector = createSelector(
  calendarsSelector,
  userIdSelector,
  (calendars, userId) =>
    calendars.filter(calendar => calendar.ownerId !== userId),
);
