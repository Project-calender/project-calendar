import React from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.css';
import MonthCalendar from '../../components/calendar/year/MonthCalendar';
import EventListModalLayout from '../../components/modal/layout/EventListModalLayout';
import EventDetailMaodalLayout from '../../components/modal/layout/EventDetailMaodalLayout';

import { selectedDateSelector } from '../../store/selectors/date';

const Index = () => {
  const year = useSelector(state => selectedDateSelector(state).year);

  const months = [...Array(12)].map((_, i) => i + 1);
  return (
    <EventDetailMaodalLayout>
      <EventListModalLayout>
        <div className={styles.year_calendar}>
          {months.map(month => (
            <MonthCalendar key={month} year={year} month={month} />
          ))}
        </div>
      </EventListModalLayout>
    </EventDetailMaodalLayout>
  );
};

export default Index;
