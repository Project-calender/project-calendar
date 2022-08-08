import { createAsyncThunk } from '@reduxjs/toolkit';
import { CALENDAR_URL } from '../../constants/api';
import axios from '../../utils/token';

export const addCalendar = createAsyncThunk(
  CALENDAR_URL.CREATE_CALENDAR,
  async ({ calendarName, calendarColor }) => {
    const { data } = await axios.post(CALENDAR_URL.CREATE_CALENDAR, {
      calendarName,
      calendarColor,
    });
    const { id, name, color, OwnerId, authority = 3 } = data.newGroupCalendar;
    return { id, name, color, OwnerId, authority };
  },
);
