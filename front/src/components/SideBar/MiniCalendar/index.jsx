import React from 'react';
import styles from './style.module.css';

import CalendarHeader from './CalendarHeader';
import WeekDaysHeader from './WeekDaysHeader';
import Week from './Week';

import { useSelector } from 'react-redux';
import { selectMonth } from '../../../store/selectors/date';

const Index = () => {
  const month = useSelector(selectMonth);

  return (
    <div className={styles.calendar_wrap}>
      <CalendarHeader />
      <table className={styles.calendar_talbe}>
        <thead>
          <WeekDaysHeader />
        </thead>
        <tbody>
          {month.map((week, index) => (
            <Week key={index} week={week} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Index;
