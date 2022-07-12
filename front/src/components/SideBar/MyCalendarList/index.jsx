import React from 'react';
import { useSelector } from 'react-redux';
import { myCalendarSelector } from '../../../store/selectors/calendars';

import CalendarList from '../CalendarList';

const Index = () => {
  const calendars = useSelector(myCalendarSelector);
  return <CalendarList title={'내 캘린더'} calendars={calendars} />;
};

export default Index;
