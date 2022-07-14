import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import EventBar from '../EventBar';
import { eventsSelector } from '../../../../../../store/selectors/events';
import { useSelector } from 'react-redux';

const Index = ({ date }) => {
  const events = useSelector(state => eventsSelector(state, date));
  if (!events) return;

  return (
    <div className={styles.event_list}>
      {events.map(event => (
        <EventBar key={event.id} eventBar={event} />
      ))}
    </div>
  );
};
Index.propTypes = {
  date: PropTypes.object,
};

export default Index;
