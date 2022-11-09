import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import EvenBar from './EventBar';
const Index = ({ eventBars }) => {
  if (!eventBars) return;

  return (
    <div className={styles.calendar_event_list}>
      {eventBars.map(eventBar => (
        <EvenBar key={eventBar.event.id} eventBar={eventBar} />
      ))}
    </div>
  );
};

Index.propTypes = {
  eventBars: PropTypes.array,
};

export default Index;
