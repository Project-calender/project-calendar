import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { calendarSelector } from '../../../../../../store/selectors/calendars';
import styles from './style.module.css';

const Index = ({ eventBar }) => {
  const eventBarDiv = useRef();
  const calendar = useSelector(state =>
    calendarSelector(state, eventBar.PrivateCalendarId || eventBar.CalendarId),
  );

  useEffect(() => {
    if (calendar)
      eventBarDiv.current.style.background = `linear-gradient(to right, ${calendar.color} 5px, ${eventBar.color} 5px)`;
  }, [eventBarDiv.current]);

  if (!eventBar) return;
  return (
    <div
      className={styles.event_bar}
      ref={eventBarDiv}
      data-scale={eventBar.scale || 1}
    >
      <em> {eventBar.name || '(제목 없음)'} </em>
    </div>
  );
};

Index.propTypes = {
  eventBar: PropTypes.object,
};

export default Index;
