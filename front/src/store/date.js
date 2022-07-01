import { createSlice } from '@reduxjs/toolkit';
import Moment from '../utils/moment';

const dateSlice = createSlice({
  name: 'date',
  initialState: { selectedDate: new Moment().toObject() },
  reducers: {
    addMonth(state, { payload }) {
      const date = new Date(state.selectedDate.time);
      date.setMonth(date.getMonth() + payload);
      state.selectedDate = new Moment(date).toObject();
    },

    addDate(state, { payload }) {
      const date = new Date(state.selectedDate.time);
      date.setDate(date.getDate() + payload);
      state.selectedDate = new Moment(date).toObject();
    },

    initDate(state) {
      const date = new Date();
      state.selectedDate = new Moment(date).toObject();
    },

    selectDate(state, { payload }) {
      state.selectedDate = new Moment(new Date(payload)).toObject();
    },
  },
});

export const { addMonth, addDate, selectDate, initDate } = dateSlice.actions;
export default dateSlice.reducer;
