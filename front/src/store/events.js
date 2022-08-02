import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createEventBar } from '../hooks/useCreateEventBar';
import Moment from '../utils/moment';
import { getAllCalendarAndEvent } from './thunk';

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
  },

  extraReducers: builder => {
    builder.addCase(getAllCalendarAndEvent.fulfilled, (state, { payload }) => {
      const events = payload.events
        .map(event => ({
          ...event,
          startTime: new Date(event.startTime).getTime(),
          endTime: new Date(event.endTime).getTime(),
        }))
        .sort(eventSort);

      const byDate = events.reduce((byDate, event) => {
        const endDate = new Moment(new Date(event.endTime)).resetTime();
        const startDate = new Moment(new Date(event.startTime)).resetTime();

        const eventBars = createEventBar({
          standardDateTime: startDate.time,
          endDateTime: endDate.time,
        });

        eventBars.forEach(eventBar => {
          const key = eventBar.time;

          byDate[key] = byDate[key] || [];
          let index = byDate[key].findIndex(event => !event);
          if (index === -1) index = byDate[key].length;
          byDate[key][index] = { id: event.id, scale: eventBar.scale };

          for (let i = 1; i < eventBar.scale; i++) {
            let nextDate = new Moment(eventBar.time).addDate(i);
            const key = nextDate.time;
            byDate[key] = byDate[key] || Array(5).fill(null);
            byDate[key][index] = { id: event.id, scale: null };
          }
        });

        return byDate;
      }, {});

      eventsAdapter.setAll(state, events);
      state.byDate = byDate;
    });
  },
});

export const { updateEvent } = events.actions;
export default events.reducer;
