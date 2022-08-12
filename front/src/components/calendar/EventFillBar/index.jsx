import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { EVENT } from '../../../store/events';

const Index = ({
  event,
  eventBar,
  clickEventBar,
  color,
  left,
  right,
  isSelected,
}) => {
  const eventBarStyle = getEventBarStyle(event, eventBar, color, right);
  const eventBarClass = getEventClass(event, isSelected, left, right);
  return (
    <div
      className={eventBarClass.container}
      style={eventBarStyle.container}
      onClick={clickEventBar}
    >
      {left && <div className={styles.event_left} style={eventBarStyle.left} />}

      <div className={styles.event_bar}>
        <div
          className={eventBarClass.calendar}
          style={eventBarStyle.calendar}
        />
        <div
          className={eventBarClass.main}
          style={eventBarStyle.main}
          name="event_bar"
        >
          <em className={eventBarClass.text}>
            {event?.name || eventBar.eventName || '(제목 없음)'}
          </em>
        </div>
      </div>

      {right && (
        <>
          <div className={styles.event_right} style={eventBarStyle.right} />
          {(event?.state === EVENT.state.default ||
            event?.state === EVENT.state.refuse) && (
            <>
              <div
                className={`${styles.event_right} ${styles.event_right_extra}`}
                style={eventBarStyle.right}
              />
              <div
                className={`${styles.event_right} ${styles.event_right_line}`}
                style={eventBarStyle.right}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

function getEventBarStyle(event, eventBar, color, right) {
  const { calendarColor, eventBarColor } = color;
  return {
    container: {
      width: `calc(100% * ${eventBar?.scale} + ${eventBar?.scale}px - 8px)`,
    },
    calendar: {
      background: calendarColor,
      border: `1px solid ${calendarColor}`,
    },
    main: {
      background: eventBarColor,
      color: 'white',
      border: `1px solid ${eventBarColor}`,
      borderRightColor: eventBarColor,
      ...((event?.state === EVENT.state.default ||
        event?.state === EVENT.state.refuse) && {
        background: 'white',
        color: eventBarColor,
        borderRightColor: right ? 'white' : eventBarColor,
      }),
    },
    left: { borderRightColor: calendarColor },
    right: { borderLeftColor: eventBarColor },
  };
}

function getEventClass(event, isSelected, left, right) {
  return {
    container: `${styles.event_container} ${
      isSelected ? styles.event_bar_active : ''
    }`,
    calendar: (() => {
      let className = styles.event_bar_calendar;
      if (left) className += ` ${styles.none_left_border}`;
      return className;
    })(),
    main: (() => {
      let className = styles.event_bar_main;
      if (event?.state === EVENT.state.toBeDetermined)
        className += ` ${styles.event_bar_slash}`;
      if (right) className += ` ${styles.none_right_border}`;
      return className;
    })(),
    text: `${event?.state === EVENT.state.refuse ? styles.refuse_text : ''}`,
  };
}

Index.propTypes = {
  event: PropTypes.object,
  eventBar: PropTypes.object,
  color: PropTypes.object,
  clickEventBar: PropTypes.func,
  left: PropTypes.bool,
  right: PropTypes.bool,
  isSelected: PropTypes.bool,
};

export default Index;
