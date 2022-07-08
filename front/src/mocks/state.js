export const user = {
  id: 101,
  email: 'user@naver.com',
  nickname: '사용자',
  checked: [1, 2, 3],
};

export const calendars = [
  {
    calendarId: 0,
    calendarName: '캘린더0',
    color: '#D81B60',
    owner: 101,
    checked: true,
  },

  {
    calendarId: 0,
    calendarName: '캘린더0',
    color: '#D81B60',
    owner: 101,
    checked: true,
  },
  {
    calendarId: 1,
    calendarName: '캘린더1',
    color: '#8E24AA',
    owner: 101,
    checked: true,
  },
  {
    calendarId: 2,
    calendarName: '캘린더2',
    color: '#7CB342',
    owner: 1,
    checked: true,
  },
];

export const events = [
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
];

export const event = {
  name: '이벤트명',
  color: '#AD1457',
  priority: 1,
  memo: '메모입니다.',
  startTime: new Date(),
  endTime: new Date(),
  eventHostId: 101,
  calendarId: 0,
  allDay: true,
};
