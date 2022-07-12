import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { fetchEvents } from './thunk';
import Moment from '../utils/moment';

const eventsAdapter = createEntityAdapter({ selectId: state => state.time });
const initialState = eventsAdapter.getInitialState();

const events = createSlice({
  name: 'events',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, { payload }) => {
      const times = payload.events.reduce((times, event) => {
        const startTime = new Date(event.startTime);
        const key = new Date(
          startTime.getFullYear(),
          startTime.getMonth(),
          startTime.getDate(),
        ).getTime();

        const time = times.get(key) || [];
        time.push({
          ...event,
          startTime: new Moment(new Date(event.startTime)).toObject(),
          endTime: new Moment(new Date(event.endTime)).toObject(),
        });

        return times.set(key, time);
      }, new Map());

      const data = [];
      for (const [time, events] of times.entries()) {
        data.push({
          time,
          events,
        });
      }
      eventsAdapter.setAll(state, data);
    });
  },
});

export const { action } = events.actions;
export default events.reducer;
