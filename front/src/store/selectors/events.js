import { createSelector } from '@reduxjs/toolkit';
import { eventsAdapter } from '../events';

export const { selectById: selectEventById, selectAll: allEventSelector } =
  eventsAdapter.getSelectors(state => state.events);

export const eventsByDateSelector = createSelector(
  [state => state.events.byDate, (_, date) => date.time],
  (byDate, dateTime) => byDate[dateTime] || [],
);

export const eventSelector = createSelector(
  [state => state, (_, eventId) => eventId],
  (state, eventId) => (eventId ? selectEventById(state, eventId) : null),
);

export const eventsByEventIdsSelector = createSelector(
  [state => state, (_, events) => events],
  (state, events) =>
    events.map(event => (event?.id ? selectEventById(state, event.id) : null)),
);
