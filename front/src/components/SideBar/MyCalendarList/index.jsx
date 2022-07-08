import React from 'react';
import { useSelector } from 'react-redux';
import {
  myCalendarsSelector,
  privateCalendarSelector,
} from '../../../store/selectors/calendars';

import CalendarList from '../CalendarList';

const Index = () => {
  const privateCalendar = useSelector(privateCalendarSelector);
  const calendars = useSelector(myCalendarsSelector);
  return (
    <CalendarList
      title={'내 캘린더'}
      calendars={privateCalendar.concat(calendars)}
    />
  );
};

export default Index;
