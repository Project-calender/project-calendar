import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader';
import CalendarAxis from './CalendarAxis';
import CalendarBody from './CalendarBody';
import AllDayEventList from './AllDayEventList';
import { useSelector } from 'react-redux';
import { allEventSelector } from '../../../store/selectors/events';
import Moment from '../../../utils/moment';
import { EVENT } from '../../../store/events';
import CreateEventMaodalLayout from '../../../modal/layout/CreateEventModalLayout';
import EventDetailModalLayout from '../../../modal/layout/EventDetailModalLayout';

const Index = ({ dates }) => {
  const events = useSelector(allEventSelector);
  const allDayEvents = events.filter(isAllDay);
  const notAllDayEvents = events.filter(event => !isAllDay(event));

  function isAllDay(event) {
    return (
      event.allDay === EVENT.allDay.true ||
      new Moment(event.startTime)
        .resetTime()
        .calculateDateDiff(new Moment(event.endTime).resetTime().time) !== 0
    );
  }

  return (
    <CreateEventMaodalLayout>
      <EventDetailModalLayout>
        <div className={styles.calendar_container}>
          <CalendarHeader dates={dates} />
          <AllDayEventList dates={dates} events={allDayEvents} />
          <div className={styles.calendar_context}>
            <CalendarAxis />
            <CalendarBody dates={dates} events={notAllDayEvents} />
          </div>
        </div>
      </EventDetailModalLayout>
    </CreateEventMaodalLayout>
  );
};

Index.propTypes = {
  dates: PropTypes.array,
};

export default Index;
