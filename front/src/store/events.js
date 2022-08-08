import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createEventBar } from '../hooks/useCreateEventBar';
import Moment from '../utils/moment';
import { getAllCalendarAndEvent } from './thunk/event';
import { isCheckedCalander } from './user';

export const eventsAdapter = createEntityAdapter({
  selectId: state => state.id,
});

const initialState = {
  ...eventsAdapter.getInitialState(),
  byDate: {},
};

const events = createSlice({
  name: 'events',
  initialState: initialState,
  reducers: {
    updateEvent: eventsAdapter.upsertOne,
    updateEventBar(state) {
      const { selectAll } = eventsAdapter.getSelectors();
      state.byDate = classifyEventsByDate(selectAll(state));
    },
  },

  extraReducers: builder => {
    builder.addCase(getAllCalendarAndEvent.fulfilled, (state, { payload }) => {
      const events = payload.events.sort(eventSort);

      eventsAdapter.setAll(state, events);
      state.byDate = classifyEventsByDate(events);
    });
  },
});

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

export const { updateEvent, updateEventBar } = events.actions;
export default events.reducer;

const eventSort = (event, other) => {
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
};

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
