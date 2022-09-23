import React, { useContext } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import EventTimeBar from './EventTimeBar';
import EventFillBar from './EventFillBar';
import Moment from '../../../utils/moment';

import { EventDetailModalContext } from '../../../context/EventModalContext';
import { useSelector } from 'react-redux';
import { baseCalendarSelector } from '../../../store/selectors/calendars';
import { EVENT } from '../../../store/events';
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

    const eventData = await getEventDetail(event);
    setEventDetailModalData(data => ({
      ...data,
      event: eventData,
      style: { top: top + offsetTop, left: left + offsetLeft },
    }));
  }

  const baseCalendar = useSelector(baseCalendarSelector);
  const calendarColor =
    calendar?.color || eventBar?.calendarColor || baseCalendar.color;
  const eventBarColor = event?.color || eventBar?.eventColor || calendarColor;
  const isSelected = eventDetailModalData.event?.id === event?.id;

  if (!eventBar?.scale) {
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
