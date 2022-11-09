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
          event => event.CalendarId !== calendarId,
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

export function classifyEventsByDate(
  events,
  unitWeekDay = 7,
  firstStandardDate = null,
) {
  return events.reduce((byDate, event) => {
    if (!isCheckedCalander(event)) return byDate;

    const endDate = new Moment(new Date(event.endTime)).resetTime();
    const startDate = new Moment(new Date(event.startTime)).resetTime();
    const eventBars = createEventBar(
      {
        standardDateTime: startDate.time,
        endDateTime: endDate.time,
      },
      unitWeekDay,
      firstStandardDate,
    );

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
  const { id, CalendarId } = event;
  return { id, CalendarId, scale };
}

function createEmptyEventBar(event, date = [], index) {
  date[index] = EventBar(event, null);
  for (let i = index - 1; i >= 0; i--) {
    if (date[i]) break;
    date[i] = null;
  }
  return date;
}

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
      values: [
        { type: '일', time: 0, hour: 9, minute: 0 },
        { type: '일', time: 1, hour: 9, minute: 0 },
        { type: '일', time: 2, hour: 9, minute: 0 },
        { type: '주', time: 1, hour: 9, minute: 0 },
        { type: '맞춤' },
      ],
    },

    notAllDay: {
      type: ['분', '시간', '일', '주'],
      values: [
        { type: '분', time: 5 },
        { type: '분', time: 10 },
        { type: '분', time: 15 },
        { type: '분', time: 30 },
        { type: '시간', time: 1 },
        { type: '일', time: 1 },
        { type: '맞춤' },
      ],
    },

    getAllDayTitle(alert) {
      if (alert.type === '맞춤') return '맞춤...';
      const date =
        alert.time === 0
          ? '당일'
          : alert.type === '일' && alert.time === 1
          ? '전날'
          : `${alert.time}${alert.type} 전`;

      const type = alert.hour < 12 ? '오전' : '오후';
      const hour = (alert.hour > 12 ? alert.hour % 12 : alert.hour) || 12;
      const time =
        alert.minute === 0
          ? `${type} ${hour}시`
          : `${type} ${hour}:${alert.minute}`;

      return `${date} ${time}`;
    },

    getNotAllDayTitle(alert) {
      if (alert.type === '맞춤') return '맞춤...';
      return `${alert.time}${alert.type} 전`;
    },

    ASC_SORT(a, b) {
      const types = { 분: 1, 시간: 2, 일: 3, 주: 4, 맞춤: 5 };
      if (types[a.type] === types[b.type]) {
        if (a.time === b.time) {
          if (a.hour === b.hour) return a.minute - b.minute;
          return a.hour - b.hour;
        }
        return a.time - b.time;
      }
      return types[a.type] - types[b.type];
    },
  },
};
