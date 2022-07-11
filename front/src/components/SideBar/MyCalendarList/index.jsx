import React from 'react';
import { useSelector } from 'react-redux';
import { myCalendarsSelector } from '../../../store/selectors/calendars';

import CalendarList from '../CalendarList';

const Index = () => {
  const calendars = useSelector(myCalendarsSelector);
  return <CalendarList title={'내 캘린더'} calendars={calendars} />;
};

export default Index;
