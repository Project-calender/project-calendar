import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { fetchCalendarsAndEvents } from './thunk';

export const getCalendarCheckId = calendar =>
  calendar.UserId ? 'p' : `${calendar.id}`;

export const calendarsAdapter = createEntityAdapter();
const initialState = calendarsAdapter.getInitialState();

const calendars = createSlice({
  name: 'calendars',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCalendarsAndEvents.fulfilled, (state, { payload }) =>
      calendarsAdapter.setAll(state, payload.calendars),
    );
  },
});

export const { action } = calendars.actions;

export default calendars.reducer;
