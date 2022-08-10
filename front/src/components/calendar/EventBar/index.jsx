import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { EVENT_URL } from '../../../constants/api';
import { EventDetailModalContext } from '../../../context/EventModalContext';
import axios from '../../../utils/token';
import styles from './style.module.css';
import Moment from '../../../utils/moment.js';
import EventTimeBar from '../EventTimeBar';
import { useSelector } from 'react-redux';
import { checkedCalendarSelector } from '../../../store/selectors/user';
import { selectAllCalendar } from '../../../store/selectors/calendars';

const Index = ({
  event,
  calendar,
  eventBar,
  left = false,
  right = false,
  handleEventDetailMadal = () => {},
}) => {
  const {
    setModalData: setEventDetailModalData,
    modalData: eventDetailModalData,
  } = useContext(EventDetailModalContext);

  const calendars = useSelector(selectAllCalendar);
  const checkedCalendar = useSelector(checkedCalendarSelector);
  const baseCalendar =
    calendars.find(calendar => checkedCalendar.includes(calendar.id)) ||
    calendars[0];

  const calendarColor =
    calendar?.color || eventBar?.calendarColor || baseCalendar.color;
  const eventBarColor = event?.color || eventBar?.eventColor || calendarColor;
  const eventBarStyle = {
    container: {
      width: `calc(100% * ${eventBar?.scale} + ${eventBar?.scale}px - 8px)`,
    },
    calendar: {
      background: calendarColor,
      border: `1px solid ${calendarColor}`,
    },
    main: {
      background:
        event?.state === 0 || event?.state === 3 ? 'white' : eventBarColor,
      color: event?.state === 0 || event?.state === 3 ? eventBarColor : 'white',
      border: `1px solid ${eventBarColor}`,
      borderRightColor:
        right && (event?.state === 0 || event?.state === 3)
          ? 'white'
          : eventBarColor,
    },
    left: { borderRightColor: calendarColor },
    right: { borderLeftColor: eventBarColor },
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

  const isSelected = eventDetailModalData.event?.id === event?.id;
  if (
    event &&
    !event?.allDay &&
    new Moment(event.startTime).toSimpleDateString() ===
      new Moment(event.endTime).toSimpleDateString()
  )
    return (
      <EventTimeBar
        event={event}
        color={eventBarColor}
        clickEventBar={clickEventBar}
      />
    );

  return (
    <div
      className={`${styles.event_container} ${
        isSelected ? styles.event_bar_active : ''
      }`}
      style={eventBarStyle.container}
      onClick={clickEventBar}
    >
      {left && <div className={styles.event_left} style={eventBarStyle.left} />}

      <div className={`${styles.event_bar}`}>
        <div
          className={`${styles.event_bar_calendar} ${
            left ? styles.none_left_border : ''
          }`}
          style={eventBarStyle.calendar}
        />
        <div
          className={`${styles.event_bar_main} ${
            event?.state === 2 ? styles.event_bar_slash : ''
          } ${right ? styles.none_right_border : ''}`}
          style={eventBarStyle.main}
          name="event_bar"
        >
          <em className={`${event?.state === 3 ? styles.refuse_text : ''}`}>
            {event?.name || eventBar.eventName || '(제목 없음)'}
          </em>
        </div>
      </div>

      {right && (
        <>
          <div className={styles.event_right} style={eventBarStyle.right} />
          {(event?.state === 0 || event?.state === 3) && (
            <>
              <div
                className={`${styles.event_right} ${styles.event_right_temp}`}
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

Index.propTypes = {
  event: PropTypes.object,
  calendar: PropTypes.object,
  eventBar: PropTypes.object,
  left: PropTypes.bool,
  right: PropTypes.bool,
  handleEventDetailMadal: PropTypes.func,
};

export default Index;
