import { createSelector } from '@reduxjs/toolkit';
import { calculateMonth } from '../../utils/moment';

const selectedDate = state => state.date.selectedDate;

export const selectMonth = createSelector(selectedDate, selectedDate =>
  calculateMonth(selectedDate.year, selectedDate.month),
);
