import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getAllCalendarAndEvent } from './thunk';

export const calendarsAdapter = createEntityAdapter();
const initialState = calendarsAdapter.getInitialState();

const calendars = createSlice({
  name: 'calendars',
  initialState: initialState,
  reducers: {
    addCalendar: calendarsAdapter.addOne,
  },
  extraReducers: builder => {
    builder.addCase(getAllCalendarAndEvent.fulfilled, (state, { payload }) =>
      calendarsAdapter.setAll(state, payload.calendars),
    );
  },
});

export const { addCalendar } = calendars.actions;

export default calendars.reducer;
