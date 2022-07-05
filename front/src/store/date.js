import { createSlice } from '@reduxjs/toolkit';
import Moment from '../utils/moment';

const dateSlice = createSlice({
  name: 'date',
  initialState: { selectedDate: new Moment().toObject() },
  reducers: {
    addMonth(state, { payload }) {
      const date = new Moment(state.selectedDate);
      state.selectedDate = date.addMonth(payload).toObject();
    },

    addDate(state, { payload }) {
      const date = new Moment(state.selectedDate);
      state.selectedDate = date.addDate(payload).toObject();
    },

    selectDate(state, { payload }) {
      state.selectedDate = payload;
    },
  },
});

export const { addMonth, addDate, selectDate, initDate } = dateSlice.actions;
export default dateSlice.reducer;
