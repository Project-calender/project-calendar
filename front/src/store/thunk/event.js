import { createAsyncThunk } from '@reduxjs/toolkit';
import { EVENT_URL } from '../../constants/api';
import Moment from '../../utils/moment';
import axios from '../../utils/token';

const convertPrivateId = id => id * -1;

export const getAllCalendarAndEvent = createAsyncThunk(
  EVENT_URL.GET_ALL_CALENDAR_AND_EVENT,
  async ({ startTime, endTime }) => {
    const { data } = await axios.post(EVENT_URL.GET_ALL_CALENDAR_AND_EVENT, {
      startDate: new Moment(startTime).toSimpleDateString(),
      endDate: new Moment(endTime).toSimpleDateString(),
    });

    const privateCalendar = {
      ...data.privateEvents,
      id: convertPrivateId(data.privateEvents.id),
    };
    const groupCalendars = data.groupEvents;

    const [privateEvents, groupEvents] = [
      privateCalendar.PrivateEvents.map(info => ({
        ...info,
        id: info.id * -1,
        PrivateCalendarId: convertPrivateId(info.PrivateCalendarId),
      })),
      groupCalendars.flatMap(calendar => calendar[0].GroupEvents),
    ];

    const calendars = [
      privateCalendar,
      ...groupCalendars.map(([info, authority]) => ({ ...info, ...authority })),
    ].map(calendar => {
      delete calendar.GroupEvents, delete calendar.PrivateEvents;

      if (calendar.UserId) return { ...calendar, authority: 3 };
      return calendar;
    });

    const events = privateEvents.concat(groupEvents).map(event => ({
      ...event,
      startTime: new Date(event.startTime).getTime(),
      endTime: new Date(event.endTime).getTime(),
    }));

    return { calendars, events };
  },
);

export const createEvent = createAsyncThunk(
  EVENT_URL.CREATE_GROUP_EVENT,
  async eventInfo => {
    const url =
      eventInfo.calendarId > 0
        ? EVENT_URL.CREATE_GROUP_EVENT
        : EVENT_URL.CREATE_PRIVATE_EVENT;

    const { data } = await axios.post(url, {
      ...eventInfo,
    });
    if (eventInfo.calendarId > 0) return data;
    return {
      ...data,
      id: -data.id,
      PrivateCalendarId: -data.PrivateCalendarId,
    };
  },
);

export const deleteEvent = createAsyncThunk(
  EVENT_URL.DELETE_GROUP_EVENT,
  async event => {
    const url =
      event.id > 0
        ? EVENT_URL.DELETE_GROUP_EVENT
        : EVENT_URL.DELETE_PRIVATE_EVENT;

    await axios.post(url, {
      eventId: Math.abs(event.id),
      calendarId: -event.PrivateCalendarId || event.CalendarId,
    });
    return event.id;
  },
);

export const updateEventInviteState = createAsyncThunk(
  EVENT_URL.UPDATE_EVENT_INVITE_STATE,
  async ({ event, state }) => {
    await axios.post(EVENT_URL.UPDATE_EVENT_INVITE_STATE, {
      eventId: -event.id,
      state,
    });
    return { id: event.id, state };
  },
);

export const updateEventColor = createAsyncThunk(
  EVENT_URL.UPDATE_GROUP_EVENT_COLOR,
  async ({ eventId, color }) => {
    // const url =
    //   eventId > 0
    //     ? EVENT_URL.UPDATE_GROUP_EVENT_COLOR
    //     : EVENT_URL.UPDATE_PRIVATE_EVENT_COLOR;

    // await axios.post(url, { eventId, color });
    return { id: eventId, color };
  },
);

export const getEventDetail = event => {
  return axios.post(EVENT_URL.GET_EVENT_DETAIL, {
    eventId: event.PrivateCalendarId ? event.groupEventId : event.id,
  });
};

export const checkEventInvite = async ({ guestEmail, calendarId }) => {
  const { data } = axios.post(EVENT_URL.CHECK_EVENT_INVITE, {
    guestEmail,
    calendarId,
  });
  return data;
};
