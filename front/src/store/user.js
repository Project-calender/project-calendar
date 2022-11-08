import { createSlice } from '@reduxjs/toolkit';
import { updateCheckedCalendar } from './thunk/user';

export const getUserInfo = () =>
  JSON.parse(localStorage.getItem('userInfo')) || {};
export const getCheckedCalendar = () =>
  (localStorage.getItem('checkedCalendar') || '').split(',').map(Number);

const initialState = () => ({
  ...getUserInfo(),
  checkedCalendar: getCheckedCalendar(),
});
const user = createSlice({
  name: 'user',
  initialState: initialState(),
  reducers: {
    resetUser: () => initialState(),
  },
  extraReducers: builder => {
    builder.addCase(updateCheckedCalendar.fulfilled, (state, { payload }) => {
      state.checkedCalendar = payload;
      localStorage.setItem('checkedCalendar', payload.join(','));
    });
  },
});

export function isCheckedCalander(event) {
  return getCheckedCalendar().includes(event?.CalendarId);
}

export const { resetUser } = user.actions;
export default user.reducer;
