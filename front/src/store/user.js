import { createSlice } from '@reduxjs/toolkit';
import { getCalendarCheckId } from './calendars';

const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
const user = createSlice({
  name: 'user',
  initialState: {
    ...userInfo,
    checkedCalendar: (userInfo.checkedCalender || '').split(','),
  },
  reducers: {
    updateUser(state, { payload }) {
      state = payload;
    },

    checkCalendar(state, { payload }) {
      console.log(payload);
      const target = `${getCalendarCheckId(payload)}`;
      const checkedCalendar = new Set(state.checkedCalendar);
      if (checkedCalendar.has(target)) checkedCalendar.delete(target);
      else checkedCalendar.add(target);

      state.checkedCalendar = [...checkedCalendar];
    },
  },
});

export const { updateUser, checkCalendar } = user.actions;
export default user.reducer;
