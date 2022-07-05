import React from 'react';
import { useSelector } from 'react-redux';
import { selectMonth } from '../../store/selectors/date';
import styles from './style.module.css';

import WeekDayHeader from '../../components/calendar/month/WeekDayHeader';
import CalendarBody from '../../components/calendar/month/CalendarBody';

const Index = () => {
  const month = useSelector(selectMonth);

  return (
    <div className={styles.calendar}>
      <table className={styles.calendar_table}>
        <thead>
          <WeekDayHeader />
        </thead>
        <tbody>
          <CalendarBody month={month} />
        </tbody>
      </table>
    </div>
  );
};

export default Index;
