import React, { useContext, useEffect } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { EventBarContext } from '../../../../../../context/EventBarContext';
import EventBar from '../../../../EventBar';
import { CreateEventModalContext } from '../../../../../../context/EventModalContext';

const Index = ({ dateTime }) => {
  const { isMouseDown, newEventBars } = useContext(EventBarContext);
  const eventBar = newEventBars?.find(({ time }) => dateTime === time);
  const { showModal } = useContext(CreateEventModalContext);

  useEffect(() => {
    if (eventBar && !isMouseDown) showModal();
  }, [eventBar, isMouseDown, showModal]);

  if (!eventBar) return;
  return (
    <div className={styles.new_event_bar}>
      <EventBar eventBar={eventBar} />
    </div>
  );
};

Index.propTypes = {
  dateTime: PropTypes.number,
};

export default Index;
