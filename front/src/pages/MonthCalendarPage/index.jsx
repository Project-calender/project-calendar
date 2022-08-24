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

import SimpleEventOptionModal from '../../modal/component/SimpleEventOptionModal';
import ModalLayout from '../../modal/layout/ModalLayout';
import { SimpleEventOptionModalContext } from '../../context/EventModalContext';

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
            <ModalLayout
              Modal={SimpleEventOptionModal}
              Context={SimpleEventOptionModalContext}
            >
              <MonthCalendar month={month} />
            </ModalLayout>
          </EventListModalLayout>
        </EventDetailModalLayout>
      </CreateEventMaodalLayout>
    </div>
  );
};

export default Index;
