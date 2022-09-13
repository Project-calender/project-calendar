import React from 'react';

import { useSelector } from 'react-redux';
import styles from './style.module.css';
import TimeCalendar from '../../components/calendar/TimeCalendar';

const Index = () => {
  const selectedDate = useSelector(state => {
    return state.date.selectedDate;
  });

  return (
    <article className={styles.today_article}>
      <TimeCalendar date={selectedDate} />
    </article>
  );
};

export default Index;
