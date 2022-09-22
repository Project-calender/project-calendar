import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

import NewEvent from './NewEvent';
import EventList from './EventList';

import { useSelector } from 'react-redux';
import {
  newEventBarByTimeSelector,
  newEventEmptyBarByTimeSelector,
} from '../../../../../store/selectors/newEvent';
import { eventsByDateSelector } from '../../../../../store/selectors/events';

const Index = ({ date, readMore, setReadMore }) => {
  const newEventBar = useSelector(state =>
    newEventBarByTimeSelector(state, date.time),
  );

  const newEventEmptyBar = useSelector(state =>
    newEventEmptyBarByTimeSelector(state, date.time),
  );

  const eventBars = useSelector(state => eventsByDateSelector(state, date));

  return (
    <div
      className={styles.event_selection_container}
      name="event-drag-space"
      data-drag-date={date.time}
    >
      {newEventBar && <NewEvent eventBar={newEventBar} />}
      <EventList
        date={date}
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
  date: PropTypes.object,
  readMore: PropTypes.bool,
  setReadMore: PropTypes.func,
};

export default Index;
