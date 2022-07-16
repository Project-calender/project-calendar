import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { fetchEvents } from './thunk';

export const eventsAdapter = createEntityAdapter({
  selectId: state => state.time,
});
const initialState = eventsAdapter.getInitialState();

const events = createSlice({
  name: 'events',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, { payload }) => {
      const times = payload.events.reduce((times, event) => {
        const startTime = new Date(event.startTime);
        const key = new Date(new Date(startTime).toDateString()).getTime();

        const time = times.get(key) || [];
        time.push({
          ...event,
          startTime: new Date(event.startTime).getTime(),
          endTime: new Date(event.endTime).getTime(),
        });

        return times.set(key, time);
      }, new Map());

      const data = [];
      for (const [time, events] of times.entries()) {
        events.sort(
          (event, otherEvent) => event.startTime - otherEvent.startTime,
        );
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
