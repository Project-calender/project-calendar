import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import CalendarInfo from './CalendarInfo';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { privateCalendarSelector } from '../../../store/selectors/calendars';

const Index = ({ title, calendars }) => {
  const [toggle, setToggle] = useState(true);
  const privateCalendar = useSelector(privateCalendarSelector);

  return (
    <details className={styles.calendar_details} open>
      <summary onClick={handleSummaryToggle}>
        <em>{title}</em>
        <FontAwesomeIcon icon={toggle ? faAngleUp : faAngleDown} />
      </summary>

      <CalendarInfo calendar={privateCalendar} remove={false} />
      {calendars.map(calendar => (
        <CalendarInfo key={calendar.calendarId} calendar={calendar} />
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
