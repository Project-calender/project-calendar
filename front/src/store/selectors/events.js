import { createSelector } from '@reduxjs/toolkit';
import { eventsAdapter } from '../events';

export const { selectById: selectEventByTime } = eventsAdapter.getSelectors(
  state => state.events,
);

export const eventsSelector = createSelector(
  [state => state, (_, date) => date.time],
  (state, dateTime) => {
    const time = selectEventByTime(state, dateTime);
    return time ? time.events : null;
  },
);
