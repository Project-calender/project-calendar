import React from 'react';

import { useSelector } from 'react-redux';
import TimeCalendar from '../../components/calendar/TimeCalendar';
import Moment from '../../utils/moment';

const Index = () => {
  const selectedDate = useSelector(state => state.date.selectedDate);
  const date = new Moment(selectedDate);
  const dates = Array.from(Array(4), (_, i) => date.addDate(i));

  return <TimeCalendar dates={dates} />;
};

export default Index;
