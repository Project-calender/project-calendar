import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { monthSelector } from '../../store/selectors/date';
import styles from './style.module.css';

import WeekDayHeader from '../../components/calendar/month/WeekDayHeader';
import CalendarBody from '../../components/calendar/month/CalendarBody';
import EventListModalLayout from '../../modal/layout/EventListModalLayout';
import EventDetailModalLayout from '../../modal/layout/EventDetailModalLayout';
import CreateEventMaodalLayout from '../../modal/layout/CreateEventModalLayout';

import { EventBarContext } from '../../context/EventBarContext';

import useDragDate from '../../hooks/useDragDate';
import useCreateEventBar from '../../hooks/useCreateEventBar';
import useAddMonthByWheel from '../../hooks/useAddMonthByWheel';

import { getAllCalendarAndEvent } from '../../store/thunk/event';
import { useEffect } from 'react';
import { setNewEventBars } from '../../store/events';

const Index = () => {
  const dispatch = useDispatch();
  const {
    handleMouseDown,
    handleMouseUp,
    handleDrag,
    isMouseDown,
    selectedDateRange,
  } = useDragDate();
  const dragContextData = { isMouseDown, selectedDateRange };

  const { newEventBars } = useCreateEventBar(selectedDateRange);
  const month = useSelector(monthSelector);
  useEffect(() => {
    if (newEventBars.length) dispatch(setNewEventBars(newEventBars));
  }, [dispatch, newEventBars]);

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
      <EventBarContext.Provider value={dragContextData}>
        <CreateEventMaodalLayout>
          <EventDetailModalLayout>
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
          </EventDetailModalLayout>
        </CreateEventMaodalLayout>
      </EventBarContext.Provider>
    </div>
  );
};

export default Index;
