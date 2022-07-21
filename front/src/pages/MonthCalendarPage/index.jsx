import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { monthSelector } from '../../store/selectors/date';
import styles from './style.module.css';

import WeekDayHeader from '../../components/calendar/month/WeekDayHeader';
import CalendarBody from '../../components/calendar/month/CalendarBody';
import EventListModalLayout from '../../components/modal/layout/EventListModalLayout';
import EventDetailMaodalLayout from '../../components/modal/layout/EventDetailMaodalLayout';

import { EventBarContext } from '../../context/EventBarContext';

import useDragDate from '../../hooks/useDragDate';
import useMonthEventBar from '../../hooks/useMonthEventBar';
import useAddMonthByWheel from '../../hooks/useAddMonthByWheel';

import { fetchCalendarsAndEvents } from '../../store/thunk';
import { useEffect } from 'react';

const Index = () => {
  const {
    handleMouseDown,
    handleMouseUp,
    handleDrag,
    isMouseDown,
    selectedDateRange,
  } = useDragDate();
  const { monthEventBars } = useMonthEventBar(selectedDateRange);

  const { changeMonth } = useAddMonthByWheel();

  const dispatch = useDispatch();
  const month = useSelector(monthSelector);
  useEffect(() => {
    dispatch(
      fetchCalendarsAndEvents(
        month[0][0].time,
        month[month.length - 1][6].time,
      ),
    );
  }, [dispatch, month]);

  return (
    <div className={styles.calendar} onWheel={changeMonth}>
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
              <EventBarContext.Provider value={monthEventBars}>
                <CalendarBody month={month} />
              </EventBarContext.Provider>
            </tbody>
          </table>
        </EventListModalLayout>
      </EventDetailMaodalLayout>
    </div>
  );
};

export default Index;
