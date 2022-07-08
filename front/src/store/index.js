import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import date from './date';
import calendars from './calendars';
import privateCalendar from './privateCalendar';

export default configureStore({
  reducer: {
    user,
    date,
    calendars,
    privateCalendar,
  },
});
