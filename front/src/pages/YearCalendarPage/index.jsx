import React from 'react';
import { useSelector } from 'react-redux';
import { stateSelectedDate } from '../../store/selectors/date';
import styles from './style.module.css';
import MonthCalendar from '../../components/calendar/year/MonthCalendar';

const Index = () => {
  const { year } = useSelector(stateSelectedDate);
  const months = [...Array(12)].map((_, i) => i + 1);

  return (
    <div className={styles.year_calendar}>
      {months.map(month => (
        <MonthCalendar key={month} year={year} month={month} />
      ))}
    </div>
  );
};

export default Index;
