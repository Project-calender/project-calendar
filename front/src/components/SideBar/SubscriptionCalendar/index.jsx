import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import CalendarInfo from '../CalendarInfo';

const calendars = [{ id: 0, calendarName: '대한민국의 휴일' }];

const Index = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <details className={styles.calendar_details} open>
      <summary onClick={handleSummaryToggle}>
        다른 캘린더
        <FontAwesomeIcon icon={toggle ? faAngleDown : faAngleUp} />
      </summary>
      <CalendarInfo calendars={calendars} />
    </details>
  );

  function handleSummaryToggle() {
    setToggle(toggle => !toggle);
  }
};

export default Index;
