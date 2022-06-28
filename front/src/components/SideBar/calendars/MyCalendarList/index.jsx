import React from 'react';
import styles from '../style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import CalendarInfo from '../CalendarInfo';

const calendars = [
  { id: 0, calendarName: '사용자' },
  { id: 1, calendarName: '스터디' },
  { id: 2, calendarName: '프로젝트' },
];

const Index = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <details className={styles.calendar_details} open>
      <summary onClick={handleSummaryToggle}>
        내 캘린더
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
