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
      delete calendar.GroupEvents, delete calendar.privateEvents;

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
