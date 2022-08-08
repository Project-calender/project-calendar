import React from 'react';
import styles from './style.module.css';

import PropTypes from 'prop-types';
import CalendarSummary from './CalendarSummary';
import CalendarItem from './CalendarItem';

const Index = ({ title, calendars }) => {
  return (
    <details className={styles.calendar_details} open>
      <CalendarSummary title={title} />

      {calendars.map(calendar => (
        <CalendarItem key={calendar.id} calendar={calendar} />
      ))}
    </details>
  );
};

Index.propTypes = {
  title: PropTypes.string,
  calendars: PropTypes.array,
};

export default Index;
