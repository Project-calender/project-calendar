import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader';
import CalendarAxis from './CalendarAxis';
import CalendarBody from './CalendarBody';

const Index = ({ dates, events = [] }) => {
  const allDayEvents = events;
  const notAllDayEvents = events;

  return (
    <table className={styles.calendar_container}>
      <CalendarHeader dates={dates} events={allDayEvents} />
      <tbody>
        <CalendarAxis />
        <CalendarBody dates={dates} events={notAllDayEvents} />
      </tbody>
    </table>
  );
};

Index.propTypes = {
  dates: PropTypes.array,
  events: PropTypes.array,
};

export default Index;
