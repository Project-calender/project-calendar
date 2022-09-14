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
    <table className={styles.calendar_table}>
      <CalendarHeader dates={dates} events={allDayEvents} />
      <tbody className={styles.calendar_body}>
        <tr>
          <CalendarAxis />
          <CalendarBody dates={dates} events={notAllDayEvents} />
        </tr>
      </tbody>
    </table>
  );
};

Index.propTypes = {
  dates: PropTypes.array,
  events: PropTypes.array,
};

export default Index;
