import { createSelector } from '@reduxjs/toolkit';
import { calculateMonth } from '../../utils/moment';

export const stateSelectedDate = state => state.date.selectedDate;

export const selectMonth = createSelector(stateSelectedDate, selectedDate =>
  calculateMonth(selectedDate.year, selectedDate.month),
);
