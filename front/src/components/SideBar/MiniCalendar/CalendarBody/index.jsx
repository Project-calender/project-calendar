import React, { useContext } from 'react';
import styles from './style.module.css';

import WeekDaysHeader from './WeekDaysHeader';
import Week from './Week';
import { calculateMonth } from '../../../../utils/moment';
import { miniCalendarContext } from '../../../../context/EventModalContext';

const Index = () => {
  const { calendarDate } = useContext(miniCalendarContext);
  const [year, month] = [calendarDate.year, calendarDate.month];
  const weeks = calculateMonth(year, month);

  return (
    <table className={styles.calendar_talbe}>
      <thead>
        <WeekDaysHeader />
      </thead>
      <tbody>
        {weeks.map((week, index) => (
          <Week key={index} week={week} month={month} />
        ))}
      </tbody>
    </table>
  );
};

export default Index;
