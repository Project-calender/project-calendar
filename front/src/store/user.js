import { createSlice } from '@reduxjs/toolkit';
import { USER_URL } from '../constants/api';
import axios from '../utils/token';

export const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
export const getCheckedCalendar = () =>
  (localStorage.getItem('checkedCalendar') || '').split(',').map(Number);

const user = createSlice({
  name: 'user',
  initialState: {
    ...userInfo,
    checkedCalendar: getCheckedCalendar(),
  },
  reducers: {
    updateUser(state, { payload }) {
      state = payload;
    },

    checkCalendar(state, { payload: { id, checked } }) {
      const checkedCalendar = new Set(state.checkedCalendar);
      if (checked) checkedCalendar.add(id);
      else checkedCalendar.delete(id);

      axios.post(USER_URL.CHECK_CALENDAR, {
        checkedList: [...checkedCalendar],
      });
      state.checkedCalendar = [...checkedCalendar];
      localStorage.setItem('checkedCalendar', state.checkedCalendar.join(','));
    },
  },
});

export function isCheckedCalander(event) {
  return getCheckedCalendar().includes(
    event?.PrivateCalendarId || event?.CalendarId,
  );
}

export const { updateUser, checkCalendar } = user.actions;
export default user.reducer;
