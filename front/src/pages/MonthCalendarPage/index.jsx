import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMonth } from '../../store/selectors/date';
import styles from './style.module.css';

import WeekDayHeader from '../../components/calendar/month/WeekDayHeader';
import CalendarBody from '../../components/calendar/month/CalendarBody';
import { addMonth } from '../../store/date';

const Index = () => {
  const month = useSelector(selectMonth);
  const dispatch = useDispatch();

  function changeMonth(e) {
    if (e.deltaY > 0) dispatch(addMonth(1));
    else dispatch(addMonth(-1));
  }

  return (
    <div className={styles.calendar} onWheel={changeMonth}>
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
