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
  alerts: { allDay: [], notAllDay: [] },
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

    addNewEventAllDayAlert(state, { payload: { type, time, hour, minute } }) {
      state.alerts.allDay.push({ type, time, hour, minute });
    },

    addNewEventNotAllDayAlert(state, { payload: { type, time } }) {
      state.alerts.notAllDay.push({ type, time });
    },

    updateNewEventAllDayAlert(state, { payload }) {
      const { index, type, time, hour, minute } = payload;
      state.alerts.allDay[index] = { type, time, hour, minute };
    },

    updateNewEventNotAllDayAlert(state, { payload }) {
      const { index, type, time } = payload;
      state.alerts.notAllDay[index] = { type, time };
    },

    updateNewEventStartTime(state, { payload }) {
      const { type, minute, hour } = payload;
      const date = new Date(state[type]);
      if (minute >= 0) date.setMinutes(minute);
      if (hour >= 0) date.setHours(hour);

      state[type] = date.getTime();
    },

    updateNewEventAlert(state, { payload }) {
      const { type, index, alert } = payload;
      state.alerts[type][index] = alert;
    },

    removeNewEvetnAlert(state, { payload }) {
      const { type, index } = payload;
      state.alerts[type] = state.alerts[type].filter(
        (_, alertIndex) => alertIndex !== index,
      );
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
  addNewEventAllDayAlert,
  addNewEventNotAllDayAlert,
  updateNewEventAllDayAlert,
  updateNewEventNotAllDayAlert,
  updateNewEventStartTime,
  updateNewEventAlert,
  removeNewEvetnAlert,
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
