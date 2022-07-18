import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import Moment from '../utils/moment';
import { fetchEvents } from './thunk';

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
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, { payload }) => {
      const events = payload.events
        .map(event => ({
          ...event,
          startTime: new Date(event.startTime).getTime(),
          endTime: new Date(event.endTime).getTime(),
        }))
        .sort(eventSort);

      const byDate = events.reduce((byDate, event) => {
        let startDate = new Moment(new Date(event.startTime)).resetTime();
        const endDate = new Moment(new Date(event.endTime)).resetTime();
        const key = startDate.time;

        // 이벤트 추가
        byDate[key] = byDate[key] || { events: [], eventBars: [] };
        byDate[key].events.push(event.id);

        // 이벤트 위치 배정
        let index = byDate[key].eventBars.findIndex(event => !event);
        index = index === -1 ? byDate[key].eventBars.length : index;
        do {
          const key = startDate.time;
          byDate[key] = byDate[key] || { events: [], eventBars: [] };
          byDate[key].eventBars[index] = event.id;
        } while (
          startDate.time !== endDate.time &&
          (startDate = startDate.addDate(1))
        );

        return byDate;
      }, {});

      eventsAdapter.setAll(state, events);
      state.byDate = byDate;
    });
  },
});

export const { setEventsByDate } = events.actions;
export default events.reducer;
