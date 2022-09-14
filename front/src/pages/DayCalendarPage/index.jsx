import React from 'react';

import { useSelector } from 'react-redux';
import TimeCalendar from '../../components/calendar/TimeCalendar';

const Index = () => {
  const selectedDate = useSelector(state => state.date.selectedDate);
  const dates = [selectedDate];

  return <TimeCalendar dates={dates} />;
};

export default Index;
