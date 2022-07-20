import { createSelector } from '@reduxjs/toolkit';
import { calculateMonth } from '../../utils/moment';

export const selectedDateSelector = state => state.date.selectedDate;

export const monthSelector = createSelector(
  [
    state => selectedDateSelector(state).year,
    state => selectedDateSelector(state).month,
  ],
  (year, month) => calculateMonth(year, month),
);
