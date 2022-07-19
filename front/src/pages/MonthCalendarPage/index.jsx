import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { monthSelector } from '../../store/selectors/date';
import styles from './style.module.css';

import WeekDayHeader from '../../components/calendar/month/WeekDayHeader';
import CalendarBody from '../../components/calendar/month/CalendarBody';
import EventListModal from '../../components/calendar/EventListModal';

import { EventBarContext } from '../../context/EventBarContext';
import { EventListModalContext } from '../../context/EventListModalContext';

import useDragDate from '../../hooks/useDragDate';
import useMonthEventBar from '../../hooks/useMonthEventBar';
import useAddMonthByWheel from '../../hooks/useAddMonthByWheel';
import useEventModal from '../../hooks/useEventModal';
import { fetchCalendarsAndEvents } from '../../store/thunk';
import { useEffect } from 'react';

const Index = () => {
  const dispatch = useDispatch();
  const {
    handleMouseDown,
    handleMouseUp,
    handleDrag,
    isMouseDown,
    selectedDateRange,
  } = useDragDate();
  const { monthEventBars } = useMonthEventBar(selectedDateRange);

  const { changeMonth } = useAddMonthByWheel();
  const { isModalShown, modalData, showModal, hideModal } = useEventModal();

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
    <div className={`test ${styles.calendar}`} onWheel={changeMonth}>
      {isModalShown && (
        <EventListModal modalData={modalData} hideModal={hideModal} />
      )}
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
        </tbody>
      </table>
    </div>
  );
};

export default Index;
