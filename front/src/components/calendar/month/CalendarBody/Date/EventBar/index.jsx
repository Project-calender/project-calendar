import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { calendarSelector } from '../../../../../../store/selectors/calendars';
import styles from './style.module.css';

const Index = ({ eventBar }) => {
  const calendar = useSelector(state =>
    calendarSelector(state, eventBar.PrivateCalendarId || eventBar.CalendarId),
  );

  const eventBarDivStyle = {
    background: `linear-gradient(to right, ${calendar?.color} 5px, ${eventBar.color} 5px)`,
    width: `calc(100% * ${eventBar.scale} + ${eventBar.scale}px - 5px)`,
  };

  if (!eventBar) return;
  return (
    <div className={styles.event_bar} style={eventBarDivStyle}>
      <em> {eventBar.name || '(제목 없음)'} </em>
    </div>
  );
};

Index.propTypes = {
  eventBar: PropTypes.object,
};

export default Index;
