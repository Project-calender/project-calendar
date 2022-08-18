import React from 'react';
import Moment from '../../../utils/moment';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { EVENT } from '../../../store/events';

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
        <em>
          {new Moment(event.startTime || eventBar.startTime).getTimeType()}{' '}
          {new Moment(event.startTime || eventBar.startTime).getSimpleTime()}
        </em>
        <em> {event?.name || eventBar?.eventName || '(제목 없음)'} </em>
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
