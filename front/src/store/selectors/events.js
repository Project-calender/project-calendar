import { createSelector } from '@reduxjs/toolkit';
import { eventsAdapter } from '../events';

export const { selectById: selectEventById } = eventsAdapter.getSelectors(
  state => state.events,
);

export const eventBarsByDateSelector = createSelector(
  [state => state, (_, date) => date.time],
  (state, dateTime) => {
    const byDate = state.events.byDate;
    if (!byDate[dateTime]) return null;

    const eventBars = Array(byDate[dateTime].eventBars.length);
    for (let i = 0; i < eventBars.length; i++) {
      const eventBar = byDate[dateTime].eventBars[i];
      if (!eventBar) continue;
      eventBars[i] = {
        event: selectEventById(state, eventBar.id),
        scale: eventBar.scale,
      };
    }
    return eventBars;
  },
);
