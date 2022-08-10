import React from 'react';
import Moment from '../../../utils/moment';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ event, color, eventBar, clickEventBar = () => {} }) => {
  const eventBarStyle = {
    calendar: {
      background: event?.state === 0 || event?.state === 3 ? 'white' : color,
      border: `1px solid ${color}`,
    },
  };
  console.log(eventBar);
  return (
    <div
      className={`${styles.time_event} event_bar_div`}
      onClick={clickEventBar}
      name="event_bar"
    >
      <div
        className={`${styles.time_event_calendar} ${
          event?.state === 2 ? styles.event_bar_slash : ''
        }`}
        style={eventBarStyle.calendar}
      />
      <div
        className={`${styles.time_event_title} ${
          event?.state === 3 ? styles.refuse_text : ''
        }`}
      >
        <em>
          {new Moment(event.startTime).getTimeType()}{' '}
          {new Moment(event.startTime).getSimpleTime()}
        </em>
        <em> {event?.name || eventBar?.name || '(제목 없음)'} </em>
      </div>
    </div>
  );
};

Index.propTypes = {
  event: PropTypes.object,
  eventBar: PropTypes.object,
  color: PropTypes.string,
  clickEventBar: PropTypes.func,
};

export default Index;
