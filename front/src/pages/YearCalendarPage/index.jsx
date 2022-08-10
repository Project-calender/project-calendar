import React from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.css';
import MonthCalendar from '../../components/calendar/year/MonthCalendar';
import EventListModalLayout from '../../modal/layout/EventListModalLayout';
import EventDetailModalLayout from '../../modal/layout/EventDetailModalLayout';

import { selectedDateSelector } from '../../store/selectors/date';

const Index = () => {
  const year = useSelector(state => selectedDateSelector(state).year);

  const months = [...Array(12)].map((_, i) => i + 1);
  return (
    <EventDetailModalLayout>
      <EventListModalLayout>
        <div className={styles.year_calendar}>
          {months.map(month => (
            <MonthCalendar key={month} year={year} month={month} />
          ))}
        </div>
      </EventListModalLayout>
    </EventDetailModalLayout>
  );
};

export default Index;
