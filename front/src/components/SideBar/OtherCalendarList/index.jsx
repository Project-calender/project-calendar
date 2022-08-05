import React from 'react';

import CalenarList from '../CalendarList';
import { useSelector } from 'react-redux';
import { otherCalendarSelector } from '../../../store/selectors/calendars';

const Index = () => {
  const calendars = useSelector(otherCalendarSelector);

  return <CalenarList title={'다른 캘린더'} calendars={calendars} />;
};

export default Index;
