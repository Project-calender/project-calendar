import { eventsAdapter } from '../events';

export const { selectById: selectEventByTime } = eventsAdapter.getSelectors(
  state => state.events,
);
