import React, { useContext, useEffect, useRef } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { EventBarContext } from '../../../../../../context/EventBarContext';
import EventBar from '../../../../EventBar';
import { CreateEventModalContext } from '../../../../../../context/EventModalContext';
import { useSelector } from 'react-redux';
import { newEventSelector } from '../../../../../../store/selectors/newEvent';

const Index = ({ eventBar }) => {
  const { isMouseDown } = useContext(EventBarContext);
  const { showModal: showCreateEventModal } = useContext(
    CreateEventModalContext,
  );
  const $eventBarParent = useRef();
  useEffect(() => {
    if (!eventBar || isMouseDown) return;

    const { left } =
      $eventBarParent.current.children[0].getBoundingClientRect();
    const minLeft = 480;
    showCreateEventModal({
      style: {
        top: 120,
        left: minLeft > left ? minLeft - left : left - 480,
      },
    });
  }, [eventBar, isMouseDown, showCreateEventModal]);

  const newEvent = useSelector(newEventSelector);
  return (
    <div className={styles.new_event_bar} ref={$eventBarParent}>
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
