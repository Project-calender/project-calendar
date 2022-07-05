import React from 'react';

import CalendarList from '../CalendarList';

const calendars = [...Array(15)].map((_, num) => ({
  id: num - 1,
  calendarName: num === 0 ? '사용자' : `스터디 ${num}`,
}));

const Index = () => {
  return <CalendarList title={'내 캘린더'} calendars={calendars} />;
};

export default Index;
