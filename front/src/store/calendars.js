import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { addCalendar } from './thunk/calendar';
import { getAllCalendarAndEvent } from './thunk/event';

export const calendarsAdapter = createEntityAdapter();
const initialState = calendarsAdapter.getInitialState();

const calendars = createSlice({
  name: 'calendars',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllCalendarAndEvent.fulfilled, (state, { payload }) =>
        calendarsAdapter.setAll(state, payload.calendars),
      )
      .addCase(addCalendar.fulfilled, (state, { payload }) =>
        calendarsAdapter.addOne(state, payload),
      );
  },
});

export const { action } = calendars.actions;

export default calendars.reducer;
