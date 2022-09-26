import React, { useEffect } from 'react';
import styles from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import TimeCalendar from '../../components/calendar/TimeCalendar';
import { getAllCalendarAndEvent } from '../../store/thunk/event';

const Index = () => {
  const selectedDate = useSelector(state => state.date.selectedDate);
  const dates = [selectedDate];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getAllCalendarAndEvent({
        startTime: selectedDate.time,
        endTime: selectedDate.time,
      }),
    );
  }, [dispatch, dates]);

  return (
    <div className={styles.day_calendar}>
      <TimeCalendar dates={dates} unitWeekDay={1} />
    </div>
  );
};

export default Index;
