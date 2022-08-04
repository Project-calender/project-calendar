import React from 'react';
import styles from './style.module.css';

import CalendarList from '../CalendarList';
import NewCalendarButton from '../NewCalendarButton';
import CreateCalendarModalLayout from '../../../modal/layout/CreateCalendarModalLayout';

import { useSelector } from 'react-redux';
import { myCalendarSelector } from '../../../store/selectors/calendars';

const Index = () => {
  const calendars = useSelector(myCalendarSelector);

  return (
    <CreateCalendarModalLayout>
      <div className={styles.calendar}>
        <CalendarList title={'내 캘린더'} calendars={calendars} />
        <NewCalendarButton />
      </div>
    </CreateCalendarModalLayout>
  );
};

export default Index;
