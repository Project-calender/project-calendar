import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { EventDetailModalContext } from '../../../context/EventModalContext';
import styles from './style.module.css';
import EventTimeBar from '../EventTimeBar';
import EventFillBar from '../EventFillBar';
import { useSelector } from 'react-redux';
import { baseCalendarSelector } from '../../../store/selectors/calendars';
import { EVENT } from '../../../store/events';
import Moment from '../../../utils/moment';
import { getEventDetail } from '../../../store/thunk/event';

const Index = ({
  event = {},
  calendar,
  eventBar = {},
  left = false,
  right = false,
  handleEventDetailMadal = () => {},
  onContextMenu = () => {},
}) => {
  const {
    setModalData: setEventDetailModalData,
    modalData: eventDetailModalData,
  } = useContext(EventDetailModalContext);

  async function clickEventBar(e) {
    const { offsetTop = 0, offsetLeft = 0 } = handleEventDetailMadal(e);
    const { top, left } = e.currentTarget.getBoundingClientRect();

    const { data } = await getEventDetail(event);
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

  const baseCalendar = useSelector(baseCalendarSelector);
  const calendarColor =
    calendar?.color || eventBar?.calendarColor || baseCalendar.color;
  const eventBarColor = event?.color || eventBar?.eventColor || calendarColor;
  const isSelected = eventDetailModalData.event?.id === event?.id;

  if (!eventBar || !eventBar.scale) {
    return <div className={styles.empty_event_bar} />;
  }

  if (isNotAllDayEvent(event, eventBar)) {
    return (
      <EventTimeBar
        event={event}
        eventBar={eventBar}
        clickEventBar={clickEventBar}
        onContextMenu={onContextMenu}
        color={eventBarColor}
        isSelected={isSelected}
      />
    );
  }

  return (
    <EventFillBar
      event={event}
      eventBar={eventBar}
      clickEventBar={clickEventBar}
      onContextMenu={onContextMenu}
      color={{ eventBarColor, calendarColor }}
      left={left}
      right={right}
      isSelected={isSelected}
    />
  );
};

function isNotAllDayEvent(event, eventBar) {
  return (
    (event.allDay === EVENT.allDay.false ||
      eventBar.allDay === EVENT.allDay.false) &&
    new Moment(event.startTime || eventBar.startTime).toSimpleDateString() ===
      new Moment(event.endTime || eventBar.endTime).toSimpleDateString()
  );
}

Index.propTypes = {
  event: PropTypes.object,
  calendar: PropTypes.object,
  eventBar: PropTypes.object,
  left: PropTypes.bool,
  right: PropTypes.bool,
  handleEventDetailMadal: PropTypes.func,
  onContextMenu: PropTypes.func,
};

export default Index;
