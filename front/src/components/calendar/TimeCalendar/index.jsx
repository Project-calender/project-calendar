import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader';
import CalendarAxis from './CalendarAxis';
import CalendarBody from './CalendarBody';
import AllDayEventList from './AllDayEventList';

const Index = ({ dates, events = [] }) => {
  const allDayEvents = events;
  const notAllDayEvents = events;

  return (
    <table className={styles.calendar_table}>
      <CalendarHeader dates={dates} />
      <tbody className={styles.calendar_body}>
        <AllDayEventList dates={dates} events={allDayEvents} />
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
