import React, { useRef } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import ReadMoreTitle from './ReadMoreTitle';
import Moment from '../../../../../../utils/moment';

import { useSelector } from 'react-redux';
import { eventsByEventIdsSelector } from '../../../../../../store/selectors/events';

import { EVENT } from '../../../../../../store/events';
import AllDayEvent from './AllDayEvent';
import EventBar from '../../../../EventBar';
import { useEffect } from 'react';

const Index = ({
  date,
  eventBars,
  newEventEmptyBar,
  readMore,
  setReadMore,
}) => {
  const $eventList = useRef();

  const events = useSelector(state =>
    eventsByEventIdsSelector(state, eventBars || []),
  ).filter(isAllDay);

  useEffect(() => {
    if (!readMore && events.length > 3) {
      setReadMore(false);
    }
  }, [events]);

  function clickReadMore() {
    setReadMore(true);
  }

  function isAllDay(event) {
    return (
      event.allDay === EVENT.allDay.true ||
      new Moment(event.startTime)
        .resetTime()
        .calculateDateDiff(new Moment(event.endTime).resetTime().time) !== 0
    );
  }

  return (
    <div
      className={styles.event_list}
      ref={$eventList}
      data-drag-date={date.time}
    >
      {newEventEmptyBar && <EventBar />}
      {(readMore
        ? events
        : events.length > 3
        ? events.slice(0, 2)
        : events.slice(0, 3)
      ).map((event, index) => (
        <AllDayEvent
          key={index}
          event={event}
          eventBar={eventBars.find(eventBar => eventBar.id === event.id)}
        />
      ))}
      {events.length > 3 && readMore === false && (
        <ReadMoreTitle events={events.slice(2)} clickReadMore={clickReadMore} />
      )}
    </div>
  );
};

Index.propTypes = {
  date: PropTypes.object,
  eventBars: PropTypes.array,
  newEventEmptyBar: PropTypes.bool,
  readMore: PropTypes.bool,
  setReadMore: PropTypes.func,
};

export default Index;
