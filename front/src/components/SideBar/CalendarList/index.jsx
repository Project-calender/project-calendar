import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import CalendarInfo from './CalendarInfo';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Index = ({ calendarType, calendars }) => {
  const [toggle, setToggle] = useState(true);
  return (
    <details className={styles.calendar_details} open>
      <summary onClick={handleSummaryToggle}>
        {calendarType}
        <FontAwesomeIcon icon={toggle ? faAngleDown : faAngleUp} />
      </summary>
      <CalendarInfo calendars={calendars} />
    </details>
  );

  function handleSummaryToggle() {
    setToggle(toggle => !toggle);
  }
};

Index.propTypes = {
  calendarType: PropTypes.string,
  calendars: PropTypes.array,
};

export default Index;
