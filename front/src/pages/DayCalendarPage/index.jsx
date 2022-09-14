import React from 'react';

import { useSelector } from 'react-redux';
import styles from './style.module.css';
import TimeCalendar from '../../components/calendar/TimeCalendar';

const Index = () => {
  const selectedDate = useSelector(state => state.date.selectedDate);
  const dates = [selectedDate];

  return (
    <article className={styles.today_article}>
      <TimeCalendar dates={dates} />
    </article>
  );
};

export default Index;
