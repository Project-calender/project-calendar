import React from 'react';

import CalendarList from '../CalendarList';

const calendars = [
  { id: 0, calendarName: '사용자' },
  { id: 1, calendarName: '스터디' },
  { id: 2, calendarName: '프로젝트' },
];

const Index = () => {
  return <CalendarList calendarType={'내 캘린더'} calendars={calendars} />;
};

export default Index;
