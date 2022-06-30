import { createSlice } from '@reduxjs/toolkit';
import Moment, { convertDateToObject } from '../utils/moment';

const dateSlice = createSlice({
  name: 'date',
  initialState: { selectedDate: new Moment().toString() },
  reducers: {
    addMonth(state, { payload }) {
      const date = new Date(state.selectedDate.time);
      date.setMonth(date.getMonth() + payload);
      state.selectedDate = convertDateToObject(date);
    },
    changeSelectDate(state, { payload }) {
      state.selectedDate = convertDateToObject(payload);
    },
  },
});

export const { addMonth, changeSelectDate } = dateSlice.actions;
export default dateSlice.reducer;
