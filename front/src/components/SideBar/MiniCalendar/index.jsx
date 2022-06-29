import React, { useEffect } from 'react';
import { useState } from 'react';
import styles from './style.module.css';

import CalendarHeader from './CalendarHeader';
import WeekDaysHeader from './WeekDaysHeader';
import Week from './Week';
import { getMonth } from '../../../utils/moment';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [month, setMonth] = useState(getMonth(new Date()));

  useEffect(() => {
    setMonth(getMonth(selectedDate));
  }, [selectedDate]);

  return (
    <div className={styles.calendar_wrap}>
      <CalendarHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      ></CalendarHeader>
      <table className={styles.calendar_talbe}>
        <thead>
          <WeekDaysHeader />
        </thead>
        <tbody>
          {month.map((week, index) => (
            <Week
              key={index}
              week={week}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Index;
