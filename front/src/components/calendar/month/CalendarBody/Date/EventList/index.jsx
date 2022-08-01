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
  const { showModal: showEventListModal, hideModal: hideEventListModal } =
    useContext(EventListModalContext);
  const { showModal: showEventDetailModal, hideModal: hideEventDetailModal } =
    useContext(EventDetailModalContext);

  const $eventList = useRef();
  if (!events) return;

  const countEventBar = Math.floor(maxHeight / 30);
  const previewEvent = countEventBar ? events.slice(0, countEventBar) : [];
  const restEvent = events.slice(countEventBar);

  function clickReadMore(e) {
    const { top, left } = $eventList.current.getBoundingClientRect();
    const minLeft = window.innerWidth - 250;
    showEventListModal({
      date,
      events: events
        .filter(event => event)
        .map(event => ({ ...event, scale: 1 })),
      style: {
        top: top - 35,
        left: minLeft < left ? minLeft : left,
      },
    });
    hideEventDetailModal();
    e.stopPropagation();
  }

  function handleEventDetailMadal(e) {
    showEventDetailModal();
    hideEventListModal();
    e.stopPropagation();

    return { offsetTop: 23 };
  }

  return (
    <div
      className={styles.event_list}
      ref={$eventList}
      data-drag-date={date.time}
    >
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
