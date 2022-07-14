import { createSelector } from '@reduxjs/toolkit';
import { calculateMonth } from '../../utils/moment';

export const selectedDateSelector = state => state.date.selectedDate;

export const monthSelector = createSelector(
  selectedDateSelector,
  selectedDate => calculateMonth(selectedDate.year, selectedDate.month),
);
