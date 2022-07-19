import React, { useContext } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import EventBar from '../EventBar';
import ReadMoreTitle from './ReadMoreTitle';

import { useSelector } from 'react-redux';
import { eventBarsByDateSelector } from '../../../../../../store/selectors/events';
import { EventListModalContext } from '../../../../../../context/EventListModalContext';

const Index = ({ date, maxHeight }) => {
  const events = useSelector(state => eventBarsByDateSelector(state, date));
  const showModal = useContext(EventListModalContext);

  if (!events) return;

  const countEventBar = Math.floor(maxHeight / 32);
  const previewEvent = countEventBar ? events.slice(0, countEventBar) : [];
  const restEvent = events.slice(countEventBar);

  function clickReadMore() {
    showModal({
      date,
      events: events.map(event => ({ ...event, scale: 1 })),
    });
  }

  return (
    <div className={styles.event_list}>
      {previewEvent.slice(0, countEventBar).map((event, index) => (
        <EventBar key={index} eventBar={event} />
      ))}
      <ReadMoreTitle events={restEvent} clickReadMore={clickReadMore} />
    </div>
  );
};

Index.propTypes = {
  date: PropTypes.object,
  maxHeight: PropTypes.number,
};

export default Index;
