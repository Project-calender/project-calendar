import React, { useEffect } from 'react';
import styles from './style.module.css';

import CalendarHeader from './CalendarHeader';
import WeekDaysHeader from './WeekDaysHeader';
import Week from './Week';

import { calculateByMonth } from '../../../utils/moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Index = () => {
  const selectedDate = useSelector(state => state.date.selectedDate);
  const [month, setMonth] = useState(calculateByMonth(new Date()));

  useEffect(() => {
    setMonth(calculateByMonth(selectedDate));
  }, [selectedDate]);

  return (
    <div className={styles.calendar_wrap}>
      <CalendarHeader></CalendarHeader>
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
