const USER_ID = localStorage.getItem('userInfo')?.id || 1;

export default {
  getAllEvent: () => ({
    privateEvents: {
      id: 1,
      name: '개인 캘린더',
      color: '#3F51B5',
      UserId: USER_ID,
      PrivateEvents: [
        {
          id: 3,
          name: '이벤트1',
          color: '#3F51B5',
          priority: 1,
          memo: '메모1',
          startTime: '2022-07-08T20:41:23.000Z',
          endTime: '2022-07-08T20:41:23.000Z',
          groupEventId: null, // 그룹 이벤트 아이디가 있다면, eventId가 아닌 groupEventId로 요청 (이벤트 참석 여부)
          state: null, // 초대 수락 상태 - null: 상태 없음, 1: 수락, 2: 거절, 3: 보류
          PrivateCalendarId: 1,
        },
        {
          id: 4,
          name: '이벤트2',
          color: '#009688',
          priority: 1,
          memo: '메모2',
          startTime: '2022-07-08T20:41:23.000Z',
          endTime: '2022-07-08T20:41:23.000Z',
          groupEventId: null,
          state: null,
          PrivateCalendarId: 1,
        },
      ],
    },
    groupEvents: [
      {
        id: 4,
        name: '캘린더1',
        color: '#D81B60',
        OwnerId: USER_ID,
        CalendarMember: {
          authority: 3, // 캘린더 권한: 1: 보기만 가능, 2: 변경 가능, 3: 변경 및 캘린더 관리 가능
          createdAt: '2022-07-10T01:44:01.000Z',
          updatedAt: '2022-07-10T01:44:01.000Z',
          deletedAt: null,
          UserId: USER_ID,
          CalendarId: 4,
        },
        GroupEvents: [
          {
            id: 1,
            name: '이벤트1-1',
            color: '#3F51B5',
            priority: 1,
            memo: 'Asdfasdf',
            startTime: '2022-07-11T20:41:23.000Z',
            endTime: '2022-07-11T20:41:23.000Z',
            EventHostId: USER_ID,
            CalendarId: 4,
          },
          {
            id: 2,
            name: '이벤트1-2',
            color: '#D81B60',
            priority: 1,
            memo: 'Asdfasdf',
            startTime: '2022-07-11T20:41:23.000Z',
            endTime: '2022-07-11T20:41:23.000Z',
            EventHostId: USER_ID,
            CalendarId: 4,
          },
        ],
      },
      {
        id: 5,
        name: '캘린더2',
        color: '#C0CA33',
        OwnerId: USER_ID,
        CalendarMember: {
          authority: 3,
          createdAt: '2022-07-10T01:44:01.000Z',
          updatedAt: '2022-07-10T01:44:01.000Z',
          deletedAt: null,
          UserId: USER_ID,
          CalendarId: 5,
        },
        GroupEvents: [
          {
            id: 5,
            name: '이벤트2-1',
            color: '#C0CA33',
            priority: 1,
            memo: 'Asdfasdf',
            startTime: '2022-07-11T20:41:23.000Z',
            endTime: '2022-07-12T20:41:23.000Z',
            EventHostId: USER_ID,
            CalendarId: 5,
          },
          {
            id: 6,
            name: '이벤트2-2',
            color: '#4F56B5',
            priority: 1,
            memo: 'Asdfasdf',
            startTime: '2022-07-11T20:41:23.000Z',
            endTime: '2022-07-14T20:41:23.000Z',
            EventHostId: USER_ID,
            CalendarId: 5,
          },
        ],
      },
      {
        id: 6,
        name: '캘린더3',
        color: '#A79B8E',
        OwnerId: 3,
        CalendarMember: {
          authority: 3,
          createdAt: '2022-07-10T01:44:01.000Z',
          updatedAt: '2022-07-10T01:44:01.000Z',
          deletedAt: null,
          UserId: USER_ID,
          CalendarId: 6,
        },
        GroupEvents: [
          {
            id: 7,
            name: '이벤트3-1',
            color: '#3F51B5',
            priority: 1,
            memo: 'Asdfasdf',
            startTime: '2022-07-11T20:41:23.000Z',
            endTime: '2022-07-12T20:41:23.000Z',
            EventHostId: 3,
            CalendarId: 6,
          },
          {
            id: 8,
            name: '이벤트3-2',
            color: '#4F56B5',
            priority: 1,
            memo: 'Asdfasdf',
            startTime: '2022-07-11T20:41:23.000Z',
            endTime: '2022-07-14T20:41:23.000Z',
            EventHostId: 3,
            CalendarId: 6,
          },
        ],
      },
      {
        id: 7,
        name: '캘린더4',
        color: '#E67C73',
        OwnerId: 3,
        CalendarMember: {
          authority: 3,
          createdAt: '2022-07-10T01:44:01.000Z',
          updatedAt: '2022-07-10T01:44:01.000Z',
          deletedAt: null,
          UserId: USER_ID,
          CalendarId: 6,
        },
        GroupEvents: [
          {
            id: 9,
            name: '이벤트4-1',
            color: '#E67C73',
            priority: 1,
            memo: 'Asdfasdf',
            startTime: '2022-07-11T20:30:23.000Z',
            endTime: '2022-07-12T20:41:23.000Z',
            EventHostId: 3,
            CalendarId: 7,
          },
          {
            id: 10,
            name: '이벤트4-2',
            color: '#4F56B5',
            priority: 1,
            memo: 'Asdfasdf',
            startTime: '2022-07-12T20:41:23.000Z',
            endTime: '2022-07-14T20:41:23.000Z',
            EventHostId: 3,
            CalendarId: 7,
          },
        ],
      },
    ],
  }),
};
