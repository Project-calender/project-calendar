export default {
  USER: {
    id: 2,
    email: 'user@naver.com',
    nickname: '사용자',
    checkedCalendar: 'p 1 2 3 5',
  },

  CALENDER: {
    PRIVATE_CALENDER: {
      id: 1,
      name: '사용자',
      color: '#3F51B5',
      UserId: 2,
      authority: 3,
    },
    GROUP_CALENDERS: [
      {
        id: 0,
        name: '캘린더0',
        color: '#D81B60',
        OwnerId: 2,
        authority: 1,
      },
      {
        id: 1,
        name: '캘린더1',
        color: '#616161',
        OwnerId: 2,
        authority: 3,
      },
      {
        id: 2,
        name: '캘린더2',
        color: '#7CB342',
        OwnerId: 2,
        authority: 3,
      },
      {
        id: 3,
        name: '캘린더3',
        color: '#E4C441',
        OwnerId: 6,
        authority: 3,
      },
      {
        id: 4,
        name: '대한민국의 휴일',
        color: '#8E24AA',
        OwnerId: 6,
        authority: 3,
      },
      {
        id: 5,
        name: '캘린더5',
        color: '#039BE5',
        OwnerId: 2,
        authority: 3,
      },
      {
        id: 6,
        name: '캘린더6',
        color: '#4285F4',
        OwnerId: 2,
        authority: 3,
      },
      {
        id: 7,
        name: '캘린더7',
        color: '#F6BF26',
        OwnerId: 2,
        authority: 3,
      },
    ],
  },

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
