import React from 'react';
import styles_calendar from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ calendars }) => {
  return (
    <>
      {calendars.map(({ id, calendarName }) => (
        <label key={id} className={styles_calendar.calendarInfo_label}>
          <input type="checkbox" /> {calendarName}
        </label>
      ))}
    </>
  );
};

Index.propTypes = {
  calendars: PropTypes.array,
};

export default Index;
