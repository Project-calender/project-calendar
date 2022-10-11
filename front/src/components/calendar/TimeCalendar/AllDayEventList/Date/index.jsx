import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

import NewEvent from './NewEvent';
import EventList from './EventList';

import { useSelector } from 'react-redux';
import {
  newEventBarByTimeSelector,
  newEventEmptyBarByTimeSelector,
} from '../../../../../store/selectors/newEvent';

const Index = ({
  dateId,
  date,
  dates,
  events,
  eventBars,
  readMore,
  setReadMore,
}) => {
  const newEventBar = useSelector(state =>
    newEventBarByTimeSelector(state, date.time),
  );

  const newEventEmptyBar = useSelector(state =>
    newEventEmptyBarByTimeSelector(state, date.time),
  );

  useEffect(() => {
    if (dateId === 0) setReadMore(null);
  }, [setReadMore, dateId]);

  return (
    <div
      className={styles.event_selection_container}
      name="event-drag-space"
      data-drag-date={date.time}
    >
      {newEventBar && <NewEvent eventBar={newEventBar} />}
      <EventList
        date={date}
        dates={dates}
        events={events}
        eventBars={eventBars}
        newEventEmptyBar={newEventEmptyBar}
        readMore={readMore}
        setReadMore={setReadMore}
      />
      <div className={styles.event_list}></div>
    </div>
  );
};

Index.propTypes = {
  dateId: PropTypes.number,
  date: PropTypes.object,
  dates: PropTypes.array,
  unitWeekDay: PropTypes.number,
  events: PropTypes.object,
  eventBars: PropTypes.array,
  readMore: PropTypes.bool,
  setReadMore: PropTypes.func,
};

export default Index;
