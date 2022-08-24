import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import EventBar from '../../../../EventBar';
import { useSelector } from 'react-redux';
import { newEventSelector } from '../../../../../../store/selectors/newEvent';

const Index = ({ eventBar }) => {
  const newEvent = useSelector(newEventSelector);
  return (
    <div className={styles.new_event_bar} name="new_event">
      <EventBar
        eventBar={{
          state: 1,
          ...eventBar,
          ...newEvent,
        }}
      />
    </div>
  );
};

Index.propTypes = {
  eventBar: PropTypes.object,
};

export default Index;
