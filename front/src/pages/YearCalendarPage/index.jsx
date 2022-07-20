import React from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.css';
import MonthCalendar from '../../components/calendar/year/MonthCalendar';
import EventListModal from '../../components/calendar/EventListModal';
import EventDetailModal from '../../components/calendar/EventDetailModal';
import useEventModal from '../../hooks/useEventModal';

import { selectedDateSelector } from '../../store/selectors/date';
import {
  EventDetailModalContext,
  EventListModalContext,
} from '../../context/EventModalContext';

const Index = () => {
  const year = useSelector(state => selectedDateSelector(state).year);
  const {
    isModalShown: isEventListModalShown,
    modalData: eventListModalData,
    showModal: showEventListModal,
    hideModal: hideEventListModal,
    setModalData: setEventListModalData,
  } = useEventModal();
  const {
    isModalShown: isEventDetailModalShown,
    modalData: eventDetailModalData,
    showModal: showEventDetailModal,
    hideModal: hideEventDetailModal,
  } = useEventModal();

  const modalContextData = { showEventListModal, setEventListModalData };

  const months = [...Array(12)].map((_, i) => i + 1);
  return (
    <div
      className={`${styles.year_calendar} ${
        isEventListModalShown ? styles.scroll_freeze : null
      }`}
    >
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

      <EventListModalContext.Provider value={modalContextData}>
        {months.map(month => (
          <MonthCalendar key={month} year={year} month={month} />
        ))}
      </EventListModalContext.Provider>
    </div>
  );
};

export default Index;
