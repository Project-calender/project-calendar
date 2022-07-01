import { configureStore } from '@reduxjs/toolkit';
import date from './date';

export default configureStore({
  reducer: {
    date,
  },
});
