import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { calendarSelector } from '../../../../../../store/selectors/calendars';
import styles from './style.module.css';

const Index = ({ eventBar }) => {
  const calendar = useSelector(state =>
    calendarSelector(
      state,
      eventBar.event &&
        (eventBar.event.PrivateCalendarId || eventBar.event.CalendarId),
    ),
  );

  const scale = eventBar.scale || 1;
  let eventBarDivStyle = {
    background: `linear-gradient(to right, ${calendar?.color} 5px, ${eventBar.event?.color} 5px)`,
    width: `calc(100% * ${scale} + ${scale}px - 5px)`,
  };

  if (!eventBar.scale)
    return <div className={`${styles.event_bar} ${styles.hidden}`}></div>;

  return (
    <div className={styles.event_bar} style={eventBarDivStyle}>
      <em> {eventBar.event?.name || '(제목 없음)'} </em>
    </div>
  );
};

Index.propTypes = {
  eventBar: PropTypes.object,
};

export default Index;
