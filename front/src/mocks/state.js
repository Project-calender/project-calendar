export default {
  USER: {
    id: 5,
    email: 'user@naver.com',
    nickname: '사용자',
    checkedCalendar: 'private 1 2 3 5',
  },
  // 그룹이벤트아이디가 있다면, 개인 이벤트가 아닌 그룹 이벤트로 요청
  // 참석자의 정보를 알기 위함
  PRIVATE_CALENDER: [
    {
      id: 'private',
      name: '사용자',
      color: '#3F51B5',
      ownerId: 5,
    },
  ],
  CALENDERS: [
    {
      id: 0,
      name: '캘린더0',
      color: '#D81B60',
      ownerId: 5,
    },
    {
      id: 1,
      name: '캘린더1',
      color: '#616161',
      ownerId: 5,
    },
    {
      id: 2,
      name: '캘린더2',
      color: '#7CB342',
      ownerId: 5,
    },
    {
      id: 3,
      name: '캘린더3',
      color: '#E4C441',
      ownerId: 6,
    },
    {
      id: 4,
      name: '대한민국의 휴일',
      color: '#8E24AA',
      ownerId: 6,
    },
    {
      id: 5,
      name: '캘린더5',
      color: '#039BE5',
      ownerId: 5,
    },
    {
      id: 6,
      name: '캘린더6',
      color: '#4285F4',
      ownerId: 5,
    },
    {
      id: 7,
      name: '캘린더7',
      color: '#F6BF26',
      ownerId: 5,
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
