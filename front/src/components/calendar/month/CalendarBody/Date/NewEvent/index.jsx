import React, { useContext, useEffect, useRef } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { EventBarContext } from '../../../../../../context/EventBarContext';
import EventBar from '../../../../EventBar';
import { CreateEventModalContext } from '../../../../../../context/EventModalContext';
import { useSelector } from 'react-redux';
import { newEventBarsSelector } from '../../../../../../store/selectors/events';

const Index = ({ dateTime }) => {
  const { isMouseDown } = useContext(EventBarContext);
  const newEventBars = useSelector(newEventBarsSelector);
  const eventBar = newEventBars?.find(({ time }) => dateTime === time);

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
  }, [newEventBars, eventBar, isMouseDown, showCreateEventModal]);

  if (!eventBar) return;
  const date = new Date(dateTime);
  date.setHours(new Date().getHours());
  date.setMinutes(Math.floor(new Date().getMinutes() / 15) * 15);

  return (
    <div className={styles.new_event_bar} ref={$eventBarParent}>
      <EventBar
        eventBar={{
          startTime: date.getTime(),
          endTime: date.getTime(),
          state: 1,
          ...eventBar,
        }}
      />
    </div>
  );
};

Index.propTypes = {
  dateTime: PropTypes.number,
};

export default Index;
