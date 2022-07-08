import { createSlice } from '@reduxjs/toolkit';
import mock from '../mocks/state';

const user = createSlice({
  name: 'user',
  initialState: {
    ...JSON.parse(localStorage.getItem('userInfo')),
    checkedCalendar: mock.USER.checkedCalendar.split(' '),
  },
  reducers: {
    updateUser(state, { payload }) {
      state = payload;
    },

    checkCalendar(state, { payload }) {
      const target = `${payload}`;
      const checkedCalendar = new Set(state.checkedCalendar);
      if (checkedCalendar.has(target)) checkedCalendar.delete(target);
      else checkedCalendar.add(target);

      state.checkedCalendar = [...checkedCalendar];
    },
  },
});

export const { updateUser, checkCalendar } = user.actions;
export default user.reducer;
