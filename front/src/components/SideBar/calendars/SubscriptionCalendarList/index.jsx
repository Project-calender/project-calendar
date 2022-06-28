import React from 'react';
import styles_parent from '../style.module.css';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faAngleDown,
  faAngleUp,
} from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';
import CalendarInfo from '../CalendarInfo';

const calendars = [{ id: 0, calendarName: '대한민국의 휴일' }];

const Index = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <div className={styles.calendar}>
      <details className={styles_parent.calendar_details} open>
        <summary onClick={handleSummaryToggle}>
          다른 캘린더
          <FontAwesomeIcon icon={toggle ? faAngleDown : faAngleUp} />
        </summary>
        <CalendarInfo calendars={calendars} />
      </details>
      <FontAwesomeIcon icon={faPlus} className={styles.calendar_icon_plus} />
    </div>
  );

  function handleSummaryToggle() {
    setToggle(toggle => !toggle);
  }
};

export default Index;
