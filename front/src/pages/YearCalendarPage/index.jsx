import React from 'react';
import { useSelector } from 'react-redux';
import { stateSelectedDate } from '../../store/selectors/date';
import styles from './style.module.css';
import CalendarBody from '../../components/SideBar/MiniCalendar/CalendarBody';

const Index = () => {
  const { year } = useSelector(stateSelectedDate);
  const months = [...Array(12)].map((_, i) => i + 1);

  return (
    <div className={styles.year_calendar}>
      {months.map(month => (
        <div key={month}>
          <p>{month}월</p>
          <CalendarBody year={year} month={month} />
        </div>
      ))}
    </div>
  );
};

export default Index;
