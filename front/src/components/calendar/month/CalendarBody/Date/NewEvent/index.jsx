import React, { useContext, useEffect, useRef } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { EventBarContext } from '../../../../../../context/EventBarContext';
import EventBar from '../../../../EventBar';
import { CreateEventModalContext } from '../../../../../../context/EventModalContext';

const Index = ({ dateTime }) => {
  const { isMouseDown, newEventBars } = useContext(EventBarContext);
  const eventBar = newEventBars?.find(({ time }) => dateTime === time);
  const { showModal } = useContext(CreateEventModalContext);
  const $eventBarParent = useRef();

  useEffect(() => {
    if (!eventBar || newEventBars[0] !== eventBar || isMouseDown) return;

    const { left } =
      $eventBarParent.current.children[0].getBoundingClientRect();
    const minLeft = 480;
    showModal({
      style: {
        top: 120,
        left: minLeft > left ? minLeft - left : left - 480,
      },
    });
  }, [newEventBars, eventBar, isMouseDown, showModal]);

  if (!eventBar) return;
  return (
    <div className={styles.new_event_bar} ref={$eventBarParent}>
      <EventBar eventBar={eventBar} />
    </div>
  );
};

Index.propTypes = {
  dateTime: PropTypes.number,
};

export default Index;
