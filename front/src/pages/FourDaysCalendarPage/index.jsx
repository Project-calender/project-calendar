import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import TimeCalendar from '../../components/calendar/TimeCalendar';
import { getAllCalendarAndEvent } from '../../store/thunk/event';
import Moment from '../../utils/moment';

const Index = () => {
  const selectedDate = useSelector(state => state.date.selectedDate);
  const date = new Moment(selectedDate);
  const dates = Array.from(Array(4), (_, i) => date.addDate(i));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getAllCalendarAndEvent({
        startTime: dates[0].time,
        endTime: dates[3].time,
      }),
    );
  }, [dispatch, dates]);

  return <TimeCalendar dates={dates} unitWeekDay={4} />;
};

export default Index;
