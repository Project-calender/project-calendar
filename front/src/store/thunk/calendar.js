import { createAsyncThunk } from '@reduxjs/toolkit';
import { CALENDAR_URL } from '../../constants/api';
import axios from '../../utils/token';

export const createCalendar = createAsyncThunk(
  CALENDAR_URL.CREATE_CALENDAR,
  async ({ calendarName, calendarColor }) => {
    const { data } = await axios.post(CALENDAR_URL.CREATE_CALENDAR, {
      calendarName,
      calendarColor,
    });
    return { ...data, authority: 3 };
  },
);

export const updateCalendar = createAsyncThunk(
  CALENDAR_URL.UPDATE_GROUP_CALENDAR,
  async ({ calendarId, calendarName, calendarColor }) => {
    const url =
      calendarId > 0
        ? CALENDAR_URL.UPDATE_GROUP_CALENDAR
        : CALENDAR_URL.UPDATE_PRIVATE_CALENDAR;

    const { data } = await axios.post(url, {
      calendarId: Math.abs(calendarId),
      calendarName,
      calendarColor,
    });

    return { ...data, id: calendarId };
  },
);

export const deleteCalendar = createAsyncThunk(
  CALENDAR_URL.DELETE_GROUP_CALENDAR,
  async calendarId => {
    await axios.post(CALENDAR_URL.DELETE_GROUP_CALENDAR, { calendarId });
    return calendarId;
  },
);
