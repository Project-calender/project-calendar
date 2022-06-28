import React from 'react';
import styles from './style.module.css';
import PropTypes from 'props-type';

const Index = ({ calendars }) => {
  return (
    <>
      {calendars.map(({ id, calendarName }) => (
        <label key={id} className={styles.calendarInfo_label}>
          <input type="checkbox" /> {calendarName}
        </label>
      ))}
    </>
  );
};

Index.propTypes = {
  calendars: PropTypes.object,
};

export default Index;
