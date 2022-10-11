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
  CALENDAR_URL.UPDATE_CALENDAR,
  async ({ calendarId, calendarName, calendarColor }) => {
    const { data } = await axios.post(CALENDAR_URL.UPDATE_CALENDAR, {
      calendarId,
      calendarName,
      calendarColor,
    });

    return { ...data, id: calendarId };
  },
);

export const deleteCalendar = createAsyncThunk(
  CALENDAR_URL.DELETE_CALENDAR,
  async calendarId => {
    await axios.post(CALENDAR_URL.DELETE_CALENDAR, {
      calendarId,
    });
    return calendarId;
  },
);

export const resignCalendar = createAsyncThunk(
  CALENDAR_URL.RESIGN_CALENDAR,
  async calendarId => {
    await axios.post(CALENDAR_URL.RESIGN_CALENDAR, {
      calendarId,
    });
    return calendarId;
  },
);

export const getAllCalendar = createAsyncThunk(
  CALENDAR_URL.GET_ALL_CALENDAR,
  async () => {
    const {
      data: { privateCalendar, groupCalendars },
    } = await axios.get(CALENDAR_URL.GET_ALL_CALENDAR);

    const calendars = [
      {
        ...privateCalendar,
        id: -privateCalendar.id,
        authority: 3,
      },
      ...groupCalendars.map(calendar => ({
        id: calendar.id,
        name: calendar.name,
        color: calendar.color,
        OwnerId: calendar.Owner.id,
        authority: calendar.CalendarMember.authority,
      })),
    ];
    return calendars;
  },
);
