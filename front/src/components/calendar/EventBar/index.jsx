import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { EVENT_URL } from '../../../constants/api';
import { EventDetailModalContext } from '../../../context/EventModalContext';
import { calendarByEventIdSelector } from '../../../store/selectors/calendars';
import { eventSelector } from '../../../store/selectors/events';
import axios from '../../../utils/token';
import styles from './style.module.css';

const Index = ({
  eventBar,
  left = false,
  right = false,
  outerRight = false,
  handleEventDetailMadal = () => {},
}) => {
  const event = useSelector(state => eventSelector(state, eventBar?.id));
  const calendar = useSelector(state =>
    calendarByEventIdSelector(state, event),
  );

  const { setModalData: setEventDetailModalData } = useContext(
    EventDetailModalContext,
  );

  const eventBarStyle = {
    container: {
      width: `calc(100% * ${eventBar?.scale} + ${eventBar?.scale}px - 5px)`,
    },
    main: {
      background: `linear-gradient(to right, ${calendar?.color} 5px, ${event?.color} 5px)`,
    },
    left: { borderRightColor: calendar?.color },
    right: { borderLeftColor: event?.color },
  };

  async function clickEventBar(e) {
    const { offsetTop = 0, offsetLeft = 0 } = handleEventDetailMadal(e);
    const { top, left } = e.currentTarget.getBoundingClientRect();

    const { data } = await axios.post(EVENT_URL.GET_EVENT_DETAIL, {
      eventId: event.PrivateCalendarId ? event.groupEventId : event.id,
    });
    const { EventMembers, EventHost } = data;
    setEventDetailModalData(data => ({
      ...data,
      event: { ...event, EventMembers, EventHost },
      style: {
        position: {
          top: top + offsetTop,
          left: left + offsetLeft,
        },
      },
    }));
  }

  if (!eventBar || !eventBar.scale) {
    return <div className={styles.empty_event_bar} />;
  }

  return (
    <div
      className={styles.event_container}
      style={eventBarStyle.container}
      onClick={clickEventBar}
    >
      {left && <div className={styles.event_left} style={eventBarStyle.left} />}

      <div className={styles.event_bar} style={eventBarStyle.main}>
        <em>{event?.name || eventBar.name || '(제목 없음)'}</em>
      </div>

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
  handleEventDetailMadal: PropTypes.func,
};

export default Index;
