import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { EVENT } from '../../../../store/events';
import Moment from '../../../../utils/moment';

const Index = ({
  event,
  color,
  eventBar,
  clickEventBar = () => {},
  onContextMenu = () => {},
  isSelected,
}) => {
  const eventBarStyle = {
    calendar: {
      background:
        event?.state === EVENT.state.default ||
        event?.state === EVENT.state.refuse
          ? 'white'
          : color,
      border: `1px solid ${color}`,
    },
  };

  return (
    <div
      className={`${styles.time_event} ${
        isSelected ? styles.event_bar_active : ''
      }`}
      onClick={clickEventBar}
      onContextMenu={e => onContextMenu(e, event)}
      name="event_bar"
    >
      <div
        className={`${styles.time_event_calendar} ${
          event?.state === EVENT.state.toBeDetermined
            ? styles.event_bar_slash
            : ''
        }`}
        style={eventBarStyle.calendar}
      />
      <div
        className={`${styles.time_event_title} ${
          event?.state === EVENT.state.refuse ? styles.refuse_text : ''
        }`}
      >
        <p>
          {new Moment(event.startTime || eventBar.startTime).getTimeType()}{' '}
          {new Moment(event.startTime || eventBar.startTime).getSimpleTime()}{' '}
          {event?.name || eventBar?.eventName || '(제목 없음)'}{' '}
        </p>
      </div>
    </div>
  );
};

Index.propTypes = {
  event: PropTypes.object,
  eventBar: PropTypes.object,
  color: PropTypes.string,
  clickEventBar: PropTypes.func,
  onContextMenu: PropTypes.func,
  isSelected: PropTypes.bool,
};

export default Index;
