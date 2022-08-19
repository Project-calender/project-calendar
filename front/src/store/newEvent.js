import { createSlice } from '@reduxjs/toolkit';
import Moment from '../utils/moment';
import { EVENT } from './events';

const initialState = {
  bars: [],
  emptyBars: [],
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
  inviteMembers: {},
};

const newEvent = createSlice({
  name: 'newEvent',
  initialState: initialState,
  reducers: {
    resetNewEventState: () => initialState,
    setNewEventBars(state, { payload }) {
      state.bars = payload;
      state.emptyBars = payload.reduce((emptyBars, bar) => {
        let date = new Moment(bar.time);
        date = date.addDate(-date.day);
        for (let i = 0; i < 7; i++) {
          emptyBars.push(date.addDate(i).time);
        }
        return emptyBars;
      }, []);
    },
    updateNewEventBarProperty(state, { payload: [key, value] }) {
      state[key] = value;
    },
    updateNewEventBarProperties(state, { payload }) {
      Object.assign(state, payload);
    },
    addInviteMember(state, { payload: member }) {
      state.inviteMembers[member.id] = member;
    },
    removeInviteMember(state, { payload: member }) {
      delete state.inviteMembers[member.id];
    },
  },
});

export const {
  setNewEventBars,
  resetNewEventState,
  updateNewEventBarProperty,
  updateNewEventBarProperties,
  addInviteMember,
  removeInviteMember,
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

  return [startDate, endDate].map(date => date.getTime());
}
