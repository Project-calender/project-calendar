import React from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.css';
import MonthCalendar from '../../components/calendar/year/MonthCalendar';
import EventListModal from '../../components/calendar/EventListModal';
import useEventModal from '../../hooks/useEventModal';
import { EventListModalContext } from '../../context/EventListModalContext';
import { selectedDateSelector } from '../../store/selectors/date';

const Index = () => {
  const year = useSelector(state => selectedDateSelector(state).year);
  const { isModalShown, modalData, showModal, hideModal, setModalData } =
    useEventModal();

  const modalContextData = { showModal, setModalData };

  const months = [...Array(12)].map((_, i) => i + 1);
  return (
    <div
      className={`${styles.year_calendar} ${
        isModalShown ? styles.scroll_freeze : null
      }`}
    >
      {isModalShown && (
        <EventListModal modalData={modalData} hideModal={hideModal} />
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
