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
import ModalLayout from '../../../modal/layout/ModalLayout';
import SimpleEventOptionModal from '../../../modal/component/SimpleEventOptionModal';
import { SimpleEventOptionModalContext } from '../../../context/EventModalContext';

const Index = ({ dates, unitWeekDay }) => {
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
        <ModalLayout
          Modal={SimpleEventOptionModal}
          Context={SimpleEventOptionModalContext}
        >
          <div className={styles.calendar_container}>
            <CalendarHeader dates={dates} />
            <AllDayEventList
              dates={dates}
              events={allDayEvents}
              unitWeekDay={unitWeekDay}
            />
            <div className={styles.calendar_context}>
              <CalendarAxis />
              <CalendarBody
                dates={dates}
                events={notAllDayEvents}
                unitWeekDay={unitWeekDay}
              />
            </div>
          </div>
        </ModalLayout>
      </EventDetailModalLayout>
    </CreateEventMaodalLayout>
  );
};

Index.propTypes = {
  dates: PropTypes.array,
  unitWeekDay: PropTypes.number,
};

export default Index;
