import { createSlice } from '@reduxjs/toolkit';
import mock from '../mocks/state';

export const getCalendarCheckId = calendar =>
  calendar.type === 'private' ? 'p' : `${calendar.id}`;

const privateCalendar = mock.CALENDER.PRIVATE_CALENDER;
const initialState = mock.CALENDER.GROUP_CALENDERS;
initialState.unshift(privateCalendar);

const calendars = createSlice({
  name: 'calendars',
  initialState: initialState,
  reducers: {
    setCalendars(state, { payload }) {
      state = payload;
    },

    insertCalendar(state, { payload }) {
      state.push(payload);
    },

    removeCalendar(state, { payload }) {
      state = state.filter(calendar => calendar.id !== payload);
    },
  },
});

export const { action } = calendars.actions;
export default calendars.reducer;
