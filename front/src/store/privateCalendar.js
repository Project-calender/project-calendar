import { createSlice } from '@reduxjs/toolkit';
import mock from '../mocks/state';

const privateCalendar = createSlice({
  name: 'privateCalendar',
  initialState: mock.PRIVATE_CALENDER,
  reducers: {},
});

export const { action } = privateCalendar.actions;
export default privateCalendar.reducer;
