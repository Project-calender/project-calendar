import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { calendarSelector } from '../../../../../../store/selectors/calendars';
import styles from './style.module.css';

const Index = ({
  eventBar,
  left = false,
  right = false,
  outerRight = false,
}) => {
  const calendar = useSelector(state =>
    calendarSelector(
      state,
      eventBar.event &&
        (eventBar.event.PrivateCalendarId || eventBar.event.CalendarId),
    ),
  );

  const eventBarStyle = {
    container: {
      width: `calc(100% * ${eventBar?.scale} + ${eventBar?.scale}px - 5px)`,
    },
    main: {
      background: `linear-gradient(to right, ${calendar?.color} 5px, ${eventBar.event?.color} 5px)`,
    },
    left: { borderRightColor: calendar?.color },
    right: { borderLeftColor: eventBar.event?.color },
  };

  return (
    <div className={styles.event_container} style={eventBarStyle.container}>
      {left && <div className={styles.event_left} style={eventBarStyle.left} />}

      {eventBar.scale && (
        <div className={styles.event_bar} style={eventBarStyle.main}>
          <em> {eventBar.event?.name || '(제목 없음)'} </em>
        </div>
      )}

      {right && (
        <div
          className={`${styles.event_right} ${
            outerRight ? styles.event_right_outer : null
          }`}
          style={eventBarStyle.right}
        />
      )}
    </div>
  );
};

Index.propTypes = {
  eventBar: PropTypes.object,
  left: PropTypes.bool,
  right: PropTypes.bool,
  outerRight: PropTypes.bool,
};

export default Index;
