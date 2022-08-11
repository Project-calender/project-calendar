import React, { useEffect } from 'react';
import styles from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { monthSelector } from '../../store/selectors/date';

import MonthCalendar from '../../components/calendar/MonthCalendar';
import EventListModalLayout from '../../modal/layout/EventListModalLayout';
import EventDetailModalLayout from '../../modal/layout/EventDetailModalLayout';
import CreateEventMaodalLayout from '../../modal/layout/CreateEventModalLayout';
import useAddMonthByWheel from '../../hooks/useAddMonthByWheel';
import { getAllCalendarAndEvent } from '../../store/thunk/event';

const Index = () => {
  const dispatch = useDispatch();

  const month = useSelector(monthSelector);
  useEffect(() => {
    dispatch(
      getAllCalendarAndEvent({
        startTime: month[0][0].time,
        endTime: month[month.length - 1][6].time,
      }),
    );
  }, [dispatch, month]);

  const { changeMonth } = useAddMonthByWheel();
  return (
    <div className={styles.calendar} onWheel={changeMonth}>
      <CreateEventMaodalLayout>
        <EventDetailModalLayout>
          <EventListModalLayout>
            <MonthCalendar month={month} />
          </EventListModalLayout>
        </EventDetailModalLayout>
      </CreateEventMaodalLayout>
    </div>
  );
};

export default Index;
