import React from 'react';
import styles from './style.module.css';

import CalendarHeader from './CalendarHeader';
import CalendarBody from './CalendarBody';
import { shallowEqual, useSelector } from 'react-redux';
import { selectedDateSelector } from '../../../store/selectors/date';

const Index = () => {
  const { year, month } = useSelector(
    state => ({
      year: selectedDateSelector(state).year,
      month: selectedDateSelector(state).month,
    }),
    shallowEqual,
  );

  return (
    <div className={styles.calendar_wrap}>
      <CalendarHeader year={year} month={month} />
      <CalendarBody year={year} month={month} />
    </div>
  );
};

export default Index;
