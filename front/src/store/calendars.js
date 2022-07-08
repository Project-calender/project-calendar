import { createSlice } from '@reduxjs/toolkit';
import mock from '../mocks/state';

const calendars = createSlice({
  name: 'calendars',
  initialState: mock.CALENDERS,
  reducers: {
    setCalendars(state, { payload }) {
      state = payload;
    },

    insertCalendar(state, { payload }) {
      state.push(payload);
    },

    removeCalendar(state, { payload }) {
      state = state.filter(calendar => calendar.calendarId !== payload);
    },
  },
});

export const { action } = calendars.actions;
export default calendars.reducer;
