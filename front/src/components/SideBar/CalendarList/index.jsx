import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import CalendarInfo from './CalendarInfo';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Index = ({ title, calendars }) => {
  const [toggle, setToggle] = useState(true);
  return (
    <details className={styles.calendar_details} open>
      <summary onClick={handleSummaryToggle}>
        {title}
        <FontAwesomeIcon icon={toggle ? faAngleDown : faAngleUp} />
      </summary>
      {calendars.map(calendar => (
        <CalendarInfo
          key={calendar.id}
          calendar={calendar}
          remove={calendar?.id >= 0}
        />
      ))}
    </details>
  );

  function handleSummaryToggle() {
    setToggle(toggle => !toggle);
  }
};

Index.propTypes = {
  title: PropTypes.string,
  calendars: PropTypes.array,
};

export default Index;
