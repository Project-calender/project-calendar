import { createSlice } from '@reduxjs/toolkit';
import Moment, { convertObjectToDate } from '../utils/moment';

const dateSlice = createSlice({
  name: 'date',
  initialState: { selectedDate: new Moment().toObject() },
  reducers: {
    addMonth(state, { payload }) {
      const date = convertObjectToDate(state.selectedDate);
      date.setMonth(date.getMonth() + payload);
      state.selectedDate = new Moment(date).toObject();
    },

    addDate(state, { payload }) {
      const date = convertObjectToDate(state.selectedDate);
      date.setDate(date.getDate() + payload);
      state.selectedDate = new Moment(date).toObject();
    },

    selectDate(state, { payload }) {
      const date = payload ? new Date(payload) : new Date();
      state.selectedDate = new Moment(date).toObject();
    },
  },
});

export const { addMonth, addDate, selectDate } = dateSlice.actions;
export default dateSlice.reducer;
