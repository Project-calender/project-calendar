import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader';
import CalendarBody from './CalendarBody';

const Index = ({ date, events = [] }) => {
  const allDayEvents = events;
  const notAllDayEvents = events;

  return (
    <div className={styles}>
      <CalendarHeader date={date} events={allDayEvents} />
      <CalendarBody date={date} events={notAllDayEvents} />
    </div>
  );
};

Index.propTypes = {
  date: PropTypes.object,
  events: PropTypes.array,
};

export default Index;
