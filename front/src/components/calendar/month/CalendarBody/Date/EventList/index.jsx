import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import EventBar from '../EventBar';
import { eventBarsByDateSelector } from '../../../../../../store/selectors/events';
import { useSelector } from 'react-redux';
import ReadMoreTitle from './ReadMoreTitle';

const Index = ({ date, maxHeight }) => {
  const events = useSelector(state => eventBarsByDateSelector(state, date));
  if (!events) return;

  const countEventBar = Math.floor(maxHeight / 32);
  const previewEvent = events.slice(0, countEventBar);
  const restEvent = events.slice(countEventBar);
  return (
    <div className={styles.event_list}>
      {previewEvent.slice(0, countEventBar).map((event, index) => (
        <EventBar key={index} eventBar={event} />
      ))}
      <ReadMoreTitle events={restEvent} />
    </div>
  );
};

Index.propTypes = {
  date: PropTypes.object,
  maxHeight: PropTypes.number,
};

export default Index;
