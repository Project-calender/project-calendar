import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { monthSelector } from '../../store/selectors/date';
import styles from './style.module.css';

import WeekDayHeader from '../../components/calendar/month/WeekDayHeader';
import CalendarBody from '../../components/calendar/month/CalendarBody';
import EventListModalLayout from '../../modal/layout/EventListModalLayout';
import EventDetailMaodalLayout from '../../modal/layout/EventDetailMaodalLayout';
import CreateEventMaodalLayout from '../../modal/layout/CreateEventModalLayout';

import { EventBarContext } from '../../context/EventBarContext';

import useDragDate from '../../hooks/useDragDate';
import useCreateEventBar from '../../hooks/useCreateEventBar';
import useAddMonthByWheel from '../../hooks/useAddMonthByWheel';

import { getAllCalendarAndEvent } from '../../store/thunk';
import { useEffect } from 'react';

const Index = () => {
  const {
    handleMouseDown,
    handleMouseUp,
    handleDrag,
    isMouseDown,
    selectedDateRange,
    changeDateRange,
  } = useDragDate();

  const newEventData = useCreateEventBar(selectedDateRange);
  const newEventContextData = {
    isMouseDown,
    ...newEventData,
    selectedDateRange,
    changeDateRange,
  };

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
      <EventBarContext.Provider value={newEventContextData}>
        <CreateEventMaodalLayout>
          <EventDetailMaodalLayout>
            <EventListModalLayout>
              <table
                className={styles.calendar_table}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={isMouseDown ? handleDrag : null}
              >
                <thead>
                  <WeekDayHeader />
                </thead>
                <tbody>
                  <CalendarBody month={month} />
                </tbody>
              </table>
            </EventListModalLayout>
          </EventDetailMaodalLayout>
        </CreateEventMaodalLayout>
      </EventBarContext.Provider>
    </div>
  );
};

export default Index;
