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

  const today = new Date();
  startDate.setHours(today.getHours());
  startDate.setMinutes(Math.floor(today.getMinutes() / 15) * 15);
  endDate.setHours(today.getHours() + 1);
  endDate.setMinutes(Math.floor(today.getMinutes() / 15) * 15);
  if (today.getMinutes() !== startDate.getMinutes()) {
    startDate.setMinutes(startDate.getMinutes() + 15);
    endDate.setMinutes(endDate.getMinutes() + 15);
  }

  return [startDate, endDate];
}
