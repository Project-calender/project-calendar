import React from 'react';
import styles from './style.module.css';
import { useSelector } from 'react-redux';
import TimeCalendar from '../../components/calendar/TimeCalendar';

const Index = () => {
  const selectedDate = useSelector(state => state.date.selectedDate);
  const dates = [selectedDate];

  return (
    <div className={styles.day_calendar}>
      <TimeCalendar dates={dates} />
    </div>
  );
};

export default Index;
