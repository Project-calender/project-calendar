import React, { useContext, useRef } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import EventBar from '../../../../EventBar';
import ReadMoreTitle from './ReadMoreTitle';
import Moment from '../../../../../../utils/moment';

import { useSelector } from 'react-redux';
import {
  eventsByDateSelector,
  eventsByEventIdsSelector,
} from '../../../../../../store/selectors/events';
import {
  EventDetailModalContext,
  SimpleEventOptionModalContext,
} from '../../../../../../context/EventModalContext';
import { calendarByEventIdsSelector } from '../../../../../../store/selectors/calendars';
import { newEventEmptyBarByTimeSelector } from '../../../../../../store/selectors/newEvent';
import { EVENT } from '../../../../../../store/events';

const Index = ({ date }) => {
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

  const restEvent = eventBars.slice(3).filter(event => event);

  function clickReadMore(e) {
    hideEventDetailModal();
    e.stopPropagation();
  }

  function handleEventDetailMadal(e) {
    showEventDetailModal();
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

  const isAllDay = event =>
    event.allDay === EVENT.allDay.true ||
    new Moment(event.startTime)
      .resetTime()
      .calculateDateDiff(new Moment(event.endTime).resetTime().time) !== 0;

  return (
    <div
      className={styles.event_list}
      ref={$eventList}
      data-drag-date={date.time}
    >
      {newEventEmptyBar && <EventBar />}
      {eventBars.map(
        (eventBar, index) =>
          isAllDay(events[index]) && (
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
            />
          ),
      )}
      {restEvent.length > 0 && (
        <ReadMoreTitle events={restEvent} clickReadMore={clickReadMore} />
      )}
    </div>
  );
};

Index.propTypes = {
  date: PropTypes.object,
  maxHeight: PropTypes.number,
};

export default Index;
