import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import {
  createCalendar,
  deleteCalendar,
  getAllCalendar,
  resignCalendar,
  updateCalendar,
} from './thunk/calendar';
import { getAllCalendarAndEvent } from './thunk/event';

export const calendarsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    if (a.authority === b.authority) return a.id - b.id;
    return b.authority - a.authority;
  },
});
const initialState = calendarsAdapter.getInitialState();

const calendars = createSlice({
  name: 'calendars',
  initialState: initialState,
  reducers: {
    resetCalendarState: () => ({}),
  },
  extraReducers: builder => {
    builder
      .addCase(getAllCalendarAndEvent.fulfilled, (state, { payload }) =>
        calendarsAdapter.setAll(state, payload.calendars),
      )
      .addCase(getAllCalendar.fulfilled, (state, { payload: calendars }) =>
        calendarsAdapter.setAll(state, calendars),
      )
      .addCase(createCalendar.fulfilled, (state, { payload }) =>
        calendarsAdapter.addOne(state, payload),
      )
      .addCase(updateCalendar.fulfilled, (state, { payload }) => {
        const { id, name, color } = payload;
        calendarsAdapter.updateOne(state, { id, changes: { name, color } });
      })
      .addCase(deleteCalendar.fulfilled, (state, { payload: id }) => {
        calendarsAdapter.removeOne(state, id);
      })
      .addCase(resignCalendar.fulfilled, (state, { payload: id }) => {
        calendarsAdapter.removeOne(state, id);
      });
  },
});

export const { resetCalendarState } = calendars.actions;

export default calendars.reducer;
