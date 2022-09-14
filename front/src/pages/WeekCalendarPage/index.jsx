import React from 'react';

import { useSelector } from 'react-redux';
import styles from './style.module.css';
import TimeCalendar from '../../components/calendar/TimeCalendar';
import Moment from '../../utils/moment';

const Index = () => {
  const selectedDate = useSelector(state => state.date.selectedDate);
  const date = new Moment(selectedDate);
  const startDate = date.addDate(-date.day);
  const dates = Array.from(Array(7), (_, i) => startDate.addDate(i));

  return (
    <article className={styles.calendar_container}>
      <TimeCalendar dates={dates} />
    </article>
  );
};

export default Index;
