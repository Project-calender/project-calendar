import { createAsyncThunk } from '@reduxjs/toolkit';
import { EVENT_URL } from '../../constants/api';
import Moment from '../../utils/moment';
import axios from '../../utils/token';

export const getAllCalendarAndEvent = createAsyncThunk(
  EVENT_URL.GET_ALL_CALENDAR_AND_EVENT,
  async ({ startTime, endTime }) => {
    const { data } = await axios.post(EVENT_URL.GET_ALL_CALENDAR_AND_EVENT, {
      startDate: new Moment(startTime).toSimpleDateString(),
      endDate: new Moment(endTime).toSimpleDateString(),
    });
    const { childEvents, events: calendars } = data;
    const events = childEvents.map(convertToEventTime);
    return calendars?.reduce(
      (data, { Events, ...calendar }) => {
        data.calendars.push(calendar);
        data.events.push(...Events.map(convertToEventTime));
        return data;
      },
      {
        calendars: [],
        events: events,
      },
    );
  },
);

function convertToEventTime(event) {
  return {
    ...event,
    startTime: new Date(event.startTime).getTime(),
    endTime: new Date(event.endTime).getTime(),
  };
}

export const createEvent = createAsyncThunk(
  EVENT_URL.CREATE_EVENT,
  async event => {
    const { data } = await axios.post(EVENT_URL.CREATE_EVENT, {
      calendarId: event.calendarId,
      eventName: event.eventName,
      color: event.color,
      permission: event.permission,
      busy: event.busy,
      memo: event.memo,
      allDay: event.allDay,
      startTime: event.startTime,
      endTime: event.endTime,
      alerts: event.alerts.map(alert => {
        const type = { 분: 'minute', 시간: 'hour', 일: 'day', 주: 'week' };
        return { ...alert, type: type[alert.type] };
      }),
      guests: event.guests,
    });
    return data;
  },
);

export const updateEvent = createAsyncThunk(
  EVENT_URL.UPDATE_EVENT,
  async event => {
    const { data } = await axios.post(EVENT_URL.UPDATE_EVENT, {
      eventId: event.id,
      calendarId: event.calendarId,
      eventName: event.name,
      color: event.color,
      permission: event.permission,
      busy: event.busy,
      memo: event.memo,
      allDay: event.allDay,
      startTime: event.startTime,
      endTime: event.endTime,
      alerts: event.alerts.map(alert => {
        const type = { 분: 'minute', 시간: 'hour', 일: 'day', 주: 'week' };
        return { ...alert, type: type[alert.type] };
      }),
      guests: event.guests,
    });

    return data;
  },
);

export const deleteEvent = createAsyncThunk(
  EVENT_URL.DELETE_EVENT,
  async event => {
    await axios.post(EVENT_URL.DELETE_EVENT, {
      eventId: event.id,
      calendarId: event.CalendarId,
    });
    return event.id;
  },
);

export const updateEventInviteState = createAsyncThunk(
  EVENT_URL.UPDATE_EVENT_INVITE_STATE,
  async ({ event, state }) => {
    await axios.post(EVENT_URL.UPDATE_EVENT_INVITE_STATE, {
      eventId: event.id,
      state,
    });
    return { id: event.id, state };
  },
);

export const updateEventColor = createAsyncThunk(
  EVENT_URL.UPDATE_EVENT_COLOR,
  async ({ calendarId, eventId, color }) => {
    await axios.post(EVENT_URL.UPDATE_EVENT_COLOR, {
      calendarId,
      eventId,
      color,
    });

    return { id: eventId, color };
  },
);

export const getEventDetail = async event => {
  const { data } = await axios.post(EVENT_URL.GET_EVENT_DETAIL, {
    eventId: event.id,
  });

  const { RealTimeAlerts, ...events } = data;

  const alerts =
    RealTimeAlerts?.map(alert => {
      const types = { week: '주', day: '일', hour: '시간', minute: '분' };
      return { ...alert, type: types[alert.type] };
    }) || [];
  events.EventMembers = events.EventMembers.map(member => ({
    ...member,
    state: member.EventMember.state,
  }));

  return { ...events, alerts };
};

export const checkCreateEventInvite = async ({ guestEmail, calendarId }) => {
  try {
    const res = await axios.post(EVENT_URL.CHECK_CREATE_EVENT_INVITE, {
      guestEmail,
      calendarId,
    });
    const { id, email, nickname, ProfileImages } = res.data.guest;
    return {
      id,
      email,
      nickname,
      profileImage: ProfileImages[0].src,
      canInvite: res.data.canInvite,
    };
  } catch (error) {
    const { canInvite, message } = error.response.data || {};
    return { canInvite, id: guestEmail, email: guestEmail, message };
  }
};

export const checkEditEventInvite = async ({ guests, calendarId, eventId }) => {
  const { data } = await axios.post(EVENT_URL.CHECK_EDIT_EVENT_INVITE, {
    guests,
    calendarId,
    eventId,
  });
  return data;
};
