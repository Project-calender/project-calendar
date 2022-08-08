import { createAsyncThunk } from '@reduxjs/toolkit';
import { USER_URL } from '../../constants/api';
import axios from '../../utils/token';

export const updateCheckedCalendar = createAsyncThunk(
  USER_URL.CHECK_CALENDAR,
  async ({ checkedList }) => {
    await axios.post(USER_URL.CHECK_CALENDAR, { checkedList });
    return checkedList;
  },
);
