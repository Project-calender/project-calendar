import React, { useContext, useRef } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import EventBar from '../../../../EventBar';
import ReadMoreTitle from './ReadMoreTitle';

import { useSelector } from 'react-redux';
import { eventsByDateSelector } from '../../../../../../store/selectors/events';
import {
  EventDetailModalContext,
  EventListModalContext,
} from '../../../../../../context/EventModalContext';

const Index = ({ date, maxHeight }) => {
  const events = useSelector(state => eventsByDateSelector(state, date));
  const { showModal: showEventListModal } = useContext(EventListModalContext);
  const { showModal: showEventDetailModal } = useContext(
    EventDetailModalContext,
  );

  const $eventList = useRef();
  if (!events) return;

  const countEventBar = Math.floor(maxHeight / 32);
  const previewEvent = countEventBar ? events.slice(0, countEventBar) : [];
  const restEvent = events.slice(countEventBar);

  function clickReadMore() {
    const { top, left } = $eventList.current.getBoundingClientRect();
    const minLeft = window.innerWidth - 250;
    showEventListModal({
      date,
      events: events.map(event => ({ ...event, scale: 1 })),
      style: {
        top: top - 35,
        left: minLeft < left ? minLeft : left,
      },
    });
  }

  function handleEventDetailMadal(e, event) {
    const { top, left } = e.target.getBoundingClientRect();
    showEventDetailModal({
      style: {
        position: {
          top: top + 23,
          left: left,
        },
      },
      event,
    });
  }

  return (
    <div className={styles.event_list} ref={$eventList}>
      {previewEvent.slice(0, countEventBar).map((event, index) => (
        <EventBar
          key={index}
          eventBar={event}
          handleEventDetailMadal={handleEventDetailMadal}
        />
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
