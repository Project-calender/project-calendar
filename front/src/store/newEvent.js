import { createSlice } from '@reduxjs/toolkit';
import { EVENT } from './events';

const initialState = {
  bars: [],
  calendarId: 0,
  eventName: '',
  eventColor: null,
  calendarColor: null,
  memo: '',
  startTime: 0,
  endTime: 0,
  busy: 1,
  permission: 1,
  repeat: 0,
  allDay: EVENT.allDay.true,
  inviteMembers: [],
};

const newEvent = createSlice({
  name: 'newEvent',
  initialState: initialState,
  reducers: {
    resetNewEventState: () => initialState,
    setNewEventBars(state, { payload }) {
      state.bars = payload;
    },
    updateNewEventBarProperty(state, { payload: [key, value] }) {
      state[key] = value;
    },
    updateNewEventBarProperties(state, { payload }) {
      Object.assign(state, payload);
    },
  },
});

export const {
  setNewEventBars,
  resetNewEventState,
  updateNewEventBarProperty,
  updateNewEventBarProperties,
} = newEvent.actions;

export default newEvent.reducer;

export function calculateCurrentTimeRange(startTime, endTime) {
  const [startDate, endDate] = [new Date(startTime), new Date(endTime)];

  startDate.setHours(new Date().getHours());
  startDate.setMinutes(Math.floor(new Date().getMinutes() / 15) * 15);
  endDate.setHours(new Date().getHours() + 1);
  endDate.setMinutes(Math.floor(new Date().getMinutes() / 15) * 15);
  return [startDate, endDate];
}
