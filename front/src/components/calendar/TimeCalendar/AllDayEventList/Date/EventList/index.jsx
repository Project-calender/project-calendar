import React, { useRef } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import ReadMoreTitle from './ReadMoreTitle';
import AllDayEvent from './AllDayEvent';
import EventBar from '../../../../EventBar';
import { useEffect } from 'react';

const Index = ({
  date,
  dates,
  events,
  eventBars,
  newEventEmptyBar,
  readMore,
  setReadMore,
}) => {
  const $eventList = useRef();

  useEffect(() => {
    if (!readMore && eventBars.length > 3) {
      setReadMore(false);
    }
  }, [eventBars]);

  function clickReadMore() {
    setReadMore(true);
  }

  const previewEventBars = readMore
    ? eventBars
    : eventBars.length > 3
    ? eventBars.slice(0, 3)
    : eventBars;

  const resetEventBars = eventBars
    .slice(previewEventBars.length)
    .filter(eventBar => eventBar);

  return (
    <div
      className={styles.event_list}
      ref={$eventList}
      data-drag-date={date.time}
    >
      {newEventEmptyBar && <EventBar />}
      {previewEventBars.map((eventBar, index) => (
        <AllDayEvent
          key={index}
          dates={dates}
          eventBar={eventBar}
          event={events[eventBar?.id]}
        />
      ))}
      {eventBars.length > 3 && readMore === false && (
        <ReadMoreTitle events={resetEventBars} clickReadMore={clickReadMore} />
      )}
    </div>
  );
};

Index.propTypes = {
  date: PropTypes.object,
  dates: PropTypes.array,
  events: PropTypes.object,
  eventBars: PropTypes.array,
  newEventEmptyBar: PropTypes.bool,
  readMore: PropTypes.bool,
  setReadMore: PropTypes.func,
};

export default Index;
