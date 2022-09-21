import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

import NewEvent from './NewEvent';
import EventList from './EventList';

import { useSelector } from 'react-redux';
import { newEventBarByTimeSelector } from '../../../../../store/selectors/newEvent';

const Index = ({ date }) => {
  const containerDiv = useRef();

  const newEventBar = useSelector(state =>
    newEventBarByTimeSelector(state, date.time),
  );

  return (
    <div
      className={styles.event_selection_container}
      name="event-drag-space"
      data-drag-date={date.time}
      ref={containerDiv}
    >
      {newEventBar && <NewEvent eventBar={newEventBar} />}
      <EventList date={date} />
      <div className={styles.event_list}></div>
    </div>
  );
};

Index.propTypes = {
  date: PropTypes.object,
};

export default Index;
