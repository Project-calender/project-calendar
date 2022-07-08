export default {
  USER: {
    id: 5,
    email: 'user@naver.com',
    nickname: '사용자',
    checked: [1, 2, 3],
  },

  CALENDERS: [
    {
      calendarId: 0,
      calendarName: '사용자',
      color: '#D81B60',
      calendarHostId: 5,
      type: 'private',
    },
    {
      calendarId: 1,
      calendarName: '캘린더1',
      color: '#D81B60',
      calendarHostId: 5,
    },
    {
      calendarId: 2,
      calendarName: '대한민국의 휴일',
      color: '#8E24AA',
      calendarHostId: 6,
    },
    {
      calendarId: 3,
      calendarName: '캘린더2',
      color: '#7CB342',
      calendarHostId: 5,
    },
    {
      calendarId: 3,
      calendarName: '캘린더3',
      color: '#7CB342',
      calendarHostId: 6,
    },
  ],

  EVENTS: [
    {
      eventId: 0,
      calendarId: 0,
      name: '이벤트명',
      eventColor: '#AD1457',
      calendarColor: '#AD1457',
      startTime: new Date(),
      endTime: new Date(),
      allDay: true,
    },
  ],

  EVENT: {
    name: '이벤트명',
    color: '#AD1457',
    priority: 1,
    memo: '메모입니다.',
    startTime: new Date(),
    endTime: new Date(),
    eventcalendarHostId: 101,
    calendarId: 0,
    allDay: true,
  },
};
