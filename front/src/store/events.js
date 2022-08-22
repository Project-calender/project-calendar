import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createEventBar } from '../hooks/useCreateEventBar';
import Moment from '../utils/moment';
import { deleteCalendar, resignCalendar } from './thunk/calendar';
import {
  createEvent,
  deleteEvent,
  getAllCalendarAndEvent,
  updateEventColor,
  updateEventInviteState,
} from './thunk/event';
import { updateCheckedCalendar } from './thunk/user';
import { isCheckedCalander } from './user';

export const EVENT = {
  busy: ['바쁨', '한가함'],
  repeat: startDate => [
    '반복 안함',
    '매일',
    `매주 ${startDate.weekDay}요일`,
    `매월 마지막 ${startDate.weekDay}요일`,
    `매년 ${startDate.month}월 ${startDate.date}일`,
    '주중 매일(월-금)',
    '맞춤...',
  ],
  permission: ['기본 공개 설정', '전체 공개', '비공개'],
  state: {
    default: 0,
    accept: 1,
    toBeDetermined: 2,
    refuse: 3,
  },
  allDay: {
    true: 1,
    false: 0,
  },
  alerts: {
    allDay: {
      type: ['일', '주'],
      message: [
        '당일 오전 9시',
        '전날 오전 9시',
        '2일 전 오전 9시',
        '1주 전 오전 9시',
        '맞춤...',
      ],
      values: [
        { type: '일', number: 0, time: new Moment().setHour(9).time },
        { type: '일', number: 1, time: new Moment().setHour(9).time },
        { type: '일', number: 2, time: new Moment().setHour(9).time },
        { type: '주', number: 1, time: new Moment().setHour(9).time },
      ],
    },
    notAllDay: {
      type: ['분', '시간', '일', '주'],
      message: [
        '5분 전',
        '10분 전',
        '15분 전',
        '30분 전',
        '1시간 전',
        '1일 전',
        '맞춤...',
      ],
      values: [
        { type: '분', number: 5 },
        { type: '분', number: 10 },
        { type: '분', number: 15 },
        { type: '분', number: 30 },
        { type: '시간', number: 1 },
        { type: '일', number: 1 },
      ],
    },
  },
};

export const eventsAdapter = createEntityAdapter({
  selectId: state => state.id,
  sortComparer: eventSort,
});
const { selectAll } = eventsAdapter.getSelectors();

const initialState = {
  ...eventsAdapter.getInitialState(),
  byDate: {},
};

const events = createSlice({
  name: 'events',
  initialState: initialState,
  reducers: {
    resetEventState: () => ({}),
    updateEventBar(state) {
      const { selectAll } = eventsAdapter.getSelectors();
      state.byDate = classifyEventsByDate(selectAll(state));
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getAllCalendarAndEvent.fulfilled, (state, { payload }) => {
        const events = payload.events.sort(eventSort);
        eventsAdapter.setAll(state, events);
        state.byDate = classifyEventsByDate(events);
      })
      .addCase(updateCheckedCalendar.fulfilled, state => {
        state.byDate = classifyEventsByDate(selectAll(state));
      })
      .addCase(deleteCalendar.fulfilled, (state, { payload: calendarId }) => {
        const events = selectAll(state).filter(
          event => event.PrivateCalendarId || event.CalendarId !== calendarId,
        );
        eventsAdapter.setAll(state, events);
        state.byDate = classifyEventsByDate(events);
      })
      .addCase(resignCalendar.fulfilled, (state, { payload: calendarId }) => {
        const events = selectAll(state).filter(
          event => event.CalendarId !== calendarId,
        );
        eventsAdapter.setAll(state, events);
        state.byDate = classifyEventsByDate(events);
      })
      .addCase(createEvent.fulfilled, (state, { payload: event }) => {
        eventsAdapter.addOne(state, {
          ...event,
          startTime: new Date(event.startTime).getTime(),
          endTime: new Date(event.endTime).getTime(),
        });
        state.byDate = classifyEventsByDate(selectAll(state));
      })
      .addCase(deleteEvent.fulfilled, (state, { payload: eventId }) => {
        eventsAdapter.removeOne(state, eventId);
        state.byDate = classifyEventsByDate(selectAll(state));
      })
      .addCase(updateEventInviteState.fulfilled, (state, { payload }) => {
        const { id, state: inviteState } = payload;
        eventsAdapter.updateOne(state, { id, changes: { state: inviteState } });
      })
      .addCase(updateEventColor.fulfilled, (state, { payload }) => {
        const { id, color } = payload;
        eventsAdapter.updateOne(state, { id, changes: { color } });
      });
  },
});

export const { resetEventState, updateEventBar } = events.actions;
export default events.reducer;

function classifyEventsByDate(events) {
  return events.reduce((byDate, event) => {
    if (!isCheckedCalander(event)) return byDate;

    const endDate = new Moment(new Date(event.endTime)).resetTime();
    const startDate = new Moment(new Date(event.startTime)).resetTime();
    const eventBars = createEventBar({
      standardDateTime: startDate.time,
      endDateTime: endDate.time,
    });

    eventBars.forEach(eventBar => {
      const key = eventBar.time;
      byDate[key] = byDate[key] || [];

      const index = findEventBarIndex(byDate[key]);
      byDate[key][index] = EventBar(event, eventBar.scale);

      for (let i = 1; i < eventBar.scale; i++) {
        const nextDate = new Moment(eventBar.time).addDate(i);
        const key = nextDate.time;
        byDate[key] = createEmptyEventBar(event, byDate[key], index);
      }
    });

    return byDate;
  }, {});
}

function eventSort(event, other) {
  const eventDate = new Moment(new Date(event.startTime)).resetTime();
  const otherDate = new Moment(new Date(other.startTime)).resetTime();

  if (eventDate.time === otherDate.time) {
    const eventPeriod = event.startTime - event.endTime;
    const otherEventPeriod = other.startTime - other.endTime;
    if (eventPeriod === otherEventPeriod)
      return event.name.localeCompare(other.name);
    if (eventPeriod > otherEventPeriod) return 1;
    else return -1;
  }

  return eventDate.time - otherDate.time;
}

function findEventBarIndex(date) {
  const index = date.findIndex(event => !event);
  return index === -1 ? date.length : index;
}

function EventBar(event, scale) {
  const { id, PrivateCalendarId, CalendarId } = event;
  return {
    id,
    PrivateCalendarId,
    CalendarId,
    scale: scale,
  };
}

function createEmptyEventBar(event, date = [], index) {
  date[index] = EventBar(event, null);
  for (let i = index - 1; i >= 0; i--) {
    if (date[i]) break;
    date[i] = null;
  }
  return date;
}
