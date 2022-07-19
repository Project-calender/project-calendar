import React, { useContext, useRef } from 'react';
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
  const $eventList = useRef();

  if (!events) return;

  const countEventBar = Math.floor(maxHeight / 32);
  const previewEvent = countEventBar ? events.slice(0, countEventBar) : [];
  const restEvent = events.slice(countEventBar);

  function clickReadMore() {
    const { top, left } = $eventList.current.getBoundingClientRect();
    const minLeft = window.innerWidth - 250;
    showModal({
      date,
      events: events.map(event => ({ ...event, scale: 1 })),
      position: {
        top: top - 35,
        left: minLeft < left ? minLeft : left,
      },
    });
  }

  return (
    <div className={styles.event_list} ref={$eventList}>
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
