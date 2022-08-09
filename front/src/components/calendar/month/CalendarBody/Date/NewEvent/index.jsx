import React, { useContext, useEffect, useRef } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { EventBarContext } from '../../../../../../context/EventBarContext';
import EventBar from '../../../../EventBar';
import EventTimeBar from '../../../../EventTimeBar';
import { CreateEventModalContext } from '../../../../../../context/EventModalContext';
import { useSelector } from 'react-redux';
import { newEventBarsSelector } from '../../../../../../store/selectors/events';

const Index = ({ dateTime }) => {
  const { isMouseDown } = useContext(EventBarContext);
  const newEventBars = useSelector(newEventBarsSelector);
  const eventBar = newEventBars?.find(({ time }) => dateTime === time);

  const { showModal } = useContext(CreateEventModalContext);
  const $eventBarParent = useRef();
  useEffect(() => {
    if (!eventBar || isMouseDown) return;

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
  const date = new Date(dateTime);
  date.setHours(new Date().getHours());
  date.setMinutes(new Date().getMinutes() - (new Date().getMinutes() % 15));

  return (
    <div className={styles.new_event_bar} ref={$eventBarParent}>
      {eventBar?.allDay === false ? (
        <EventTimeBar
          event={{
            startTime: date.getTime(),
            endTime: date.getTime(),
            state: 1,
            allDay: false,
          }}
          color={'red'}
        />
      ) : (
        <EventBar eventBar={eventBar} />
      )}
    </div>
  );
};

Index.propTypes = {
  dateTime: PropTypes.number,
};

export default Index;
