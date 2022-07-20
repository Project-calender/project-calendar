import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { monthSelector } from '../../store/selectors/date';
import styles from './style.module.css';

import WeekDayHeader from '../../components/calendar/month/WeekDayHeader';
import CalendarBody from '../../components/calendar/month/CalendarBody';
import EventListModal from '../../components/calendar/EventListModal';
import EventDetailModal from '../../components/calendar/EventDetailModal';

import { EventBarContext } from '../../context/EventBarContext';
import {
  EventListModalContext,
  EventDetailModalContext,
} from '../../context/EventModalContext';

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
  const {
    isModalShown: isEventListModalShown,
    modalData: eventListModalData,
    showModal: showEventListModal,
    hideModal: hideEventListModal,
  } = useEventModal();
  const {
    isModalShown: isEventDetailModalShown,
    modalData: eventDetailModalData,
    showModal: showEventDetailModal,
    hideModal: hideEventDetailModal,
  } = useEventModal();

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
      {isEventListModalShown && (
        <EventDetailModalContext.Provider value={showEventDetailModal}>
          <EventListModal
            modalData={eventListModalData}
            hideModal={hideEventListModal}
          />
        </EventDetailModalContext.Provider>
      )}
      {isEventDetailModalShown && (
        <EventDetailModal
          modalData={eventDetailModalData}
          hideModal={hideEventDetailModal}
        />
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
            <EventListModalContext.Provider value={showEventListModal}>
              <EventDetailModalContext.Provider value={showEventDetailModal}>
                <CalendarBody month={month} />
              </EventDetailModalContext.Provider>
            </EventListModalContext.Provider>
          </EventBarContext.Provider>
        </tbody>
      </table>
    </div>
  );
};

export default Index;
