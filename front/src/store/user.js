import { createSlice } from '@reduxjs/toolkit';
import { updateCheckedCalendar } from './thunk/user';

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
  },
  extraReducers: builder => {
    builder.addCase(updateCheckedCalendar.fulfilled, (state, { payload }) => {
      state.checkedCalendar = payload;
      localStorage.setItem('checkedCalendar', payload.join(','));
    });
  },
});

export function isCheckedCalander(event) {
  return getCheckedCalendar().includes(
    event?.PrivateCalendarId || event?.CalendarId,
  );
}

export const { updateUser } = user.actions;
export default user.reducer;
