import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './style.module.css';

import Modal from '../../../components/common/Modal';
import { CalendarOptionContext } from '../../../context/EventModalContext';
import { useContext } from 'react';
import EventColor from '../../../components/calendar/EventColor';
import { CALENDAR_COLOR } from '../../../styles/color.js';
import { updateCheckedCalendar } from '../../../store/thunk/user';
import { updateCalendar } from '../../../store/thunk/calendar';

const Index = () => {
  const { hideModal, modalData } = useContext(CalendarOptionContext);

  const dispatch = useDispatch();
  const { calendar } = modalData;
  function onClickColor(e, color) {
    dispatch(
      updateCalendar({
        calendarId: calendar.id,
        newCalendarName: calendar.name,
        newCalendarColor: color,
      }),
    );
    hideModal();
  }

  function checkOnlyOneCalendar() {
    dispatch(updateCheckedCalendar({ checkedList: [calendar.id] }));
    hideModal();
  }

  return (
    <Modal
      hideModal={hideModal}
      isBackground
      style={{ ...modalData.style, borderRadius: 0, padding: 0 }}
    >
      <div className={styles.modal_container}>
        <ul>
          <li onClick={checkOnlyOneCalendar}>이 항목만 표시</li>
          {calendar.id > 0 && <li>목록에서 숨기기</li>}
          <li>설정 및 공유</li>
        </ul>
        <hr />
        <div className={styles.color_list}>
          <EventColor colors={CALENDAR_COLOR} onClickColor={onClickColor} />
        </div>
      </div>
    </Modal>
  );
};

export default Index;
