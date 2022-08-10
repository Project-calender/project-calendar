import React, { useContext, useRef } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import EventBar from '../../../../EventBar';
import ReadMoreTitle from './ReadMoreTitle';

import { useSelector } from 'react-redux';
import {
  eventsByDateSelector,
  eventsByEventIdsSelector,
} from '../../../../../../store/selectors/events';
import {
  EventDetailModalContext,
  EventListModalContext,
} from '../../../../../../context/EventModalContext';
import { calendarByEventIdsSelector } from '../../../../../../store/selectors/calendars';

const Index = ({ date, maxHeight }) => {
  const { showModal: showEventListModal, hideModal: hideEventListModal } =
    useContext(EventListModalContext);
  const { showModal: showEventDetailModal, hideModal: hideEventDetailModal } =
    useContext(EventDetailModalContext);
  const $eventList = useRef();

  const eventBars = useSelector(state => eventsByDateSelector(state, date));
  const calendars = useSelector(state =>
    calendarByEventIdsSelector(state, eventBars || []),
  );
  const events = useSelector(state =>
    eventsByEventIdsSelector(state, eventBars || []),
  );

  if (!eventBars) return;

  const countEventBar = Math.floor(maxHeight / 30);
  const previewEvent = countEventBar ? eventBars.slice(0, countEventBar) : [];
  const restEvent = eventBars.slice(countEventBar);

  function clickReadMore(e) {
    const { top, left } = $eventList.current.getBoundingClientRect();
    showEventListModal({
      date,
      events: events.filter(event => event),
      style: { top: top - 35, left },
    });
    hideEventDetailModal();
    e.stopPropagation();
  }

  function handleEventDetailMadal(e) {
    showEventDetailModal();
    hideEventListModal();
    e.stopPropagation();

    return { offsetTop: 25 };
  }

  return (
    <div
      className={styles.event_list}
      ref={$eventList}
      data-drag-date={date.time}
    >
      {previewEvent.slice(0, countEventBar).map((eventBar, index) => (
        <EventBar
          key={index}
          event={events[index]}
          calendar={calendars[index]}
          eventBar={eventBar}
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
