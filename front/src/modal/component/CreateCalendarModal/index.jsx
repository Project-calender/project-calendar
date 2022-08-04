import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import Modal from '../../../components/common/Modal';
import TextField from '../../../components/common/TextField';
import EventColorOption from '../../../components/calendar/EventColorOption';

import { useDispatch, useSelector } from 'react-redux';
import { userEmailSelector } from '../../../store/selectors/user';
import { useContext } from 'react';
import {
  CreateCalendarModalContext,
  EventColorModalContext,
} from '../../../context/EventModalContext';
import { CALENDAR_COLOR } from '../../../styles/color';
import { useRef } from 'react';
import axios from '../../../utils/token';
import { useState } from 'react';
import { useEffect } from 'react';
import { CALENDAR_URL } from '../../../constants/api';
import { addCalendar } from '../../../store/calendars';

const Index = ({ children: ModalList }) => {
  const { hideModal, modalData } = useContext(CreateCalendarModalContext);
  const { modalData: eventColorModaldata } = useContext(EventColorModalContext);
  const selectedColor = eventColorModaldata?.calendarColor || '';

  const userEmail = useSelector(userEmailSelector);
  const $calendarName = useRef();
  const [calendarColor, setCalendarColor] = useState(CALENDAR_COLOR['토마토']);

  useEffect(() => {
    if (selectedColor) {
      setCalendarColor(selectedColor);
    }
  }, [selectedColor]);

  const dispatch = useDispatch();
  function createNewCalendar() {
    if (!$calendarName.current.value) return;
    axios
      .post(CALENDAR_URL.CREATE_CALENDAR, {
        calendarName: $calendarName.current.value,
        calendarColor,
      })
      .then(({ data }) => {
        const {
          id,
          color,
          name,
          OwnerId,
          authority = 3,
        } = data.newGroupCalendar;
        dispatch(addCalendar({ id, color, name, OwnerId, authority }));
        hideModal();
      });
  }
  return (
    <Modal
      hideModal={hideModal}
      isBackground
      style={{
        ...modalData?.style,
        boxShadow: '4px 4px 15px 8px rgb(0, 0, 0, 0.3)',
      }}
    >
      {ModalList}
      <div className={styles.modal_container}>
        <h1>새 캘린더 만들기</h1>
        <div className={styles.calendar_info}>
          <TextField label={'캘린더 이름'} autoFocus ref={$calendarName} />
          <EventColorOption colors={CALENDAR_COLOR} color={calendarColor} />
        </div>
        <div className={styles.calendar_owner}>
          <em>소유자</em>
          <p>{userEmail}</p>
        </div>
        <button onClick={createNewCalendar}>캘린더 만들기</button>
      </div>
    </Modal>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};

export default Index;
