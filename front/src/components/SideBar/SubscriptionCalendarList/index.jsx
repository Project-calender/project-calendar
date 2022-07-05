import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import CalenarList from '../CalendarList';

const calendars = [{ id: 0, calendarName: '대한민국의 휴일' }];

const Index = () => {
  return (
    <div className={styles.calendar}>
      <CalenarList title={'다른 캘린더'} calendars={calendars} />
      <FontAwesomeIcon icon={faPlus} className={styles.calendar_icon_plus} />
    </div>
  );
};

export default Index;
