import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import date from './date';

export default configureStore({
  reducer: {
    user,
    date,
  },
});
