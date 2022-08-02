import { createSlice } from '@reduxjs/toolkit';
import { USER_URL } from '../constants/api';
import axios from '../utils/token';

const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
const checkedCalendar = localStorage.getItem('checkedCalendar') || '';

const user = createSlice({
  name: 'user',
  initialState: {
    ...userInfo,
    checkedCalendar: checkedCalendar.split(',').map(Number),
  },
  reducers: {
    updateUser(state, { payload }) {
      state = payload;
    },

    checkCalendar(state, { payload }) {
      const target = payload.id;
      const checkedCalendar = new Set(state.checkedCalendar);
      if (checkedCalendar.has(target)) checkedCalendar.delete(target);
      else checkedCalendar.add(target);

      axios.post(USER_URL.CHECK_CALENDAR, {
        checkedList: state.checkedCalendar,
      });
      localStorage.setItem('checkedCalendar', state.checkedCalendar.join(','));
      state.checkedCalendar = [...checkedCalendar];
    },
  },
});

export const { updateUser, checkCalendar } = user.actions;
export default user.reducer;
