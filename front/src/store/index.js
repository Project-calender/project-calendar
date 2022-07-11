import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import date from './date';
import calendars from './calendars';

export default configureStore({
  reducer: {
    user,
    date,
    calendars,
  },
});
