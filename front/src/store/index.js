import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import date from './date';
import calendars from './calendars';
import events from './events';
import search from './search';

export default configureStore({
  reducer: {
    user,
    date,
    calendars,
    events,
    search,
  },
});
