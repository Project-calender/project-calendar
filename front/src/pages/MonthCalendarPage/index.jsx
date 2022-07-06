import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMonth } from '../../store/selectors/date';
import styles from './style.module.css';

import WeekDayHeader from '../../components/calendar/month/WeekDayHeader';
import CalendarBody from '../../components/calendar/month/CalendarBody';
import { addMonth } from '../../store/date';
import { EventBarContext } from '../../context/EventBarContext';
import useCalendarEventBar from '../../hooks/useCalendarEventBar';

const Index = () => {
  const {
    createEventBar,
    removeEventBar,
    handleDragEvent,
    isMouseUp,
    eventbars,
  } = useCalendarEventBar();

  const dispatch = useDispatch();
  function changeMonth(e) {
    if (e.deltaY > 0) dispatch(addMonth(1));
    else dispatch(addMonth(-1));
  }

  const month = useSelector(selectMonth);
  return (
    <div className={`test ${styles.calendar}`} onWheel={changeMonth}>
      <table
        className={styles.calendar_table}
        onMouseDown={createEventBar}
        onMouseUp={removeEventBar}
        onMouseMove={isMouseUp ? handleDragEvent : null}
      >
        <thead>
          <WeekDayHeader />
        </thead>
        <tbody>
          <EventBarContext.Provider value={eventbars}>
            <CalendarBody month={month} />
          </EventBarContext.Provider>
        </tbody>
      </table>
    </div>
  );
};

export default Index;
