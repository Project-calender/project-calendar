import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import TimeCalendar from '../../components/calendar/TimeCalendar';
import Moment from '../../utils/moment';
import { getAllCalendarAndEvent } from '../../store/thunk/event';
const Index = () => {
  const selectedDate = useSelector(state => state.date.selectedDate);
  const date = new Moment(selectedDate);
  const startDate = date.addDate(-date.day);
  const dates = Array.from(Array(7), (_, i) => startDate.addDate(i));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getAllCalendarAndEvent({
        startTime: dates[0].time,
        endTime: dates[6].time,
      }),
    );
  }, [dispatch, dates]);

  return <TimeCalendar dates={dates} unitWeekDay={7} />;
};

export default Index;
