import { createSlice } from '@reduxjs/toolkit';

const user = createSlice({
  name: 'user',
  initialState: {
    ...JSON.parse(localStorage.getItem('userInfo')),
    checked: [1, 2, 3, 4],
  },
  reducers: {
    updateUser(state, { payload }) {
      state = payload;
    },
  },
});

export const { updateUser } = user.actions;
export default user.reducer;
