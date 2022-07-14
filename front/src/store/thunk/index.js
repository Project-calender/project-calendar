import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../mocks/api';

export const fetchEvents = createAsyncThunk('events/getAllEvent', async () => {
  const response = await api.getAllEvent(); // 가짜 API
  const privateCalendar = {
    ...response.privateEvents,
    id: response.privateEvents.id * -1,
  };
  const groupCalendars = response.groupEvents;
  const [privateEvents, groupEvents] = [
    privateCalendar.PrivateEvents.map(info => ({
      ...info,
      id: info.id * -1,
      PrivateCalendarId: info.PrivateCalendarId * -1,
    })),
    groupCalendars.flatMap(calendar => calendar.GroupEvents),
  ];

  const calendars = [privateCalendar, ...groupCalendars].map(calendar => {
    const { id, name, color, UserId, OwnerId } = calendar;
    if (UserId) return { id, name, color, UserId, authority: 3 };
    return {
      id,
      name,
      color,
      OwnerId,
      authority: calendar.CalendarMember.authority,
    };
  });
  const events = privateEvents.concat(groupEvents);

  return { calendars, events };
});
