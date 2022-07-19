import React from 'react';
import { useSelector } from 'react-redux';
import { monthSelector } from '../../store/selectors/date';
import styles from './style.module.css';

import WeekDayHeader from '../../components/calendar/month/WeekDayHeader';
import CalendarBody from '../../components/calendar/month/CalendarBody';
import EventListModal from '../../components/calendar/month/EventListModal';

import { EventBarContext } from '../../context/EventBarContext';
import { EventListModalContext } from '../../context/EventListModalContext';

import useDragDate from '../../hooks/useDragDate';
import useMonthEventBar from '../../hooks/useMonthEventBar';
import useAddMonthByWheel from '../../hooks/useAddMonthByWheel';
import useEventModal from '../../hooks/useEventModal';

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
  const { isModalShown, modalData, showModal } = useEventModal();

  const month = useSelector(monthSelector);
  return (
    <div className={`test ${styles.calendar}`} onWheel={changeMonth}>
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
            <EventListModalContext.Provider value={showModal}>
              <CalendarBody month={month} />
            </EventListModalContext.Provider>
          </EventBarContext.Provider>
          {isModalShown && <EventListModal events={modalData} />}
        </tbody>
      </table>
    </div>
  );
};

export default Index;
