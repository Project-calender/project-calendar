import React, { useContext } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { EventBarContext } from '../../../../../../context/EventBarContext';
import EventBar from '../EventBar';

const Index = ({ dateTime }) => {
  const eventBars = useContext(EventBarContext);
  const eventBar = eventBars.find(({ time }) => dateTime === time);
  if (!eventBar) return;

  return (
    <div className={styles.new_event_bar}>
      <EventBar eventBar={eventBar} />
    </div>
  );
};

Index.propTypes = {
  dateTime: PropTypes.number,
};

export default Index;
