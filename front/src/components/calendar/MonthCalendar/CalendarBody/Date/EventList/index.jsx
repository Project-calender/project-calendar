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
  SimpleEventOptionModalContext,
} from '../../../../../../context/EventModalContext';
import { calendarByEventIdsSelector } from '../../../../../../store/selectors/calendars';
import { newEventEmptyBarByTimeSelector } from '../../../../../../store/selectors/newEvent';
import Moment from '../../../../../../utils/moment';

const Index = ({ date, maxHeight, month }) => {
  const { showModal: showEventListModal, hideModal: hideEventListModal } =
    useContext(EventListModalContext);
  const { showModal: showEventDetailModal, hideModal: hideEventDetailModal } =
    useContext(EventDetailModalContext);
  const $eventList = useRef();
  const {
    showModal: showSimpleEventOptionModal,
    hideModal: hideSimpleEventOptionModal,
  } = useContext(SimpleEventOptionModalContext);

  const eventBars = useSelector(state => eventsByDateSelector(state, date));
  const calendars = useSelector(state =>
    calendarByEventIdsSelector(state, eventBars || []),
  );
  const events = useSelector(state =>
    eventsByEventIdsSelector(state, eventBars || []),
  );

  const newEventEmptyBar = useSelector(state =>
    newEventEmptyBarByTimeSelector(state, date.time),
  );

  if (!eventBars) return;

  const countEventBar = Math.floor(maxHeight / 32) - (newEventEmptyBar ? 1 : 0);
  const previewEvent = countEventBar ? eventBars.slice(0, countEventBar) : [];
  const restEvent = eventBars.slice(countEventBar).filter(event => event);

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
    hideSimpleEventOptionModal();
    e.stopPropagation();

    return { offsetTop: 25 };
  }

  function handleSimpleEventOptionModal(e, event) {
    const { pageX, pageY } = e;
    showSimpleEventOptionModal({ style: { top: pageY, left: pageX }, event });
    hideEventDetailModal();
    e.preventDefault();
  }

  return (
    <div
      className={styles.event_list}
      ref={$eventList}
      data-drag-date={date.time}
    >
      {newEventEmptyBar && <EventBar />}
      {previewEvent.slice(0, countEventBar).map((eventBar, index) => (
        <EventBar
          key={index}
          event={events[index]}
          calendar={calendars[index]}
          eventBar={eventBar}
          handleEventDetailMadal={handleEventDetailMadal}
          onContextMenu={
            calendars[index]?.authority >= 2
              ? handleSimpleEventOptionModal
              : null
          }
          left={
            events[index] &&
            new Moment(events[index].startTime).resetTime().time <
              month[0][0].time
          }
          right={
            events[index] &&
            new Moment(events[index].endTime).resetTime().time >
              month[month.length - 1][6].time
          }
        />
      ))}
      {restEvent.length > 0 && (
        <ReadMoreTitle events={restEvent} clickReadMore={clickReadMore} />
      )}
    </div>
  );
};

Index.propTypes = {
  date: PropTypes.object,
  maxHeight: PropTypes.number,
  month: PropTypes.array,
};

export default Index;
