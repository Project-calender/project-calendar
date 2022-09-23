import React, { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import Modal from '../../../components/common/Modal';
import TextField from '../../../components/common/TextField';
import EventColorOption from '../../../components/calendar/EventColorOption';

import { useDispatch, useSelector } from 'react-redux';
import { userEmailSelector } from '../../../store/selectors/user';
import { useContext } from 'react';
import { CreateCalendarModalContext } from '../../../context/EventModalContext';
import { CALENDAR_COLOR } from '../../../styles/color';
import { useRef } from 'react';
import { createCalendar } from '../../../store/thunk/calendar';

const Index = ({ children: ModalList }) => {
  const { hideModal, modalData } = useContext(CreateCalendarModalContext);
  const [calendarColor, setCalendarColor] = useState(CALENDAR_COLOR['토마토']);

  const userEmail = useSelector(userEmailSelector);
  const $calendarName = useRef();

  const dispatch = useDispatch();
  function createNewCalendar() {
    if (!$calendarName.current.value) {
      $calendarName.current.setErrorMessage('잘못된 캘린더 이름입니다.');
      $calendarName.current.focus();
      return;
    }

    dispatch(
      createCalendar({
        calendarName: $calendarName.current.value,
        calendarColor,
      }),
    );
    hideModal();
  }

  return (
    <Modal
      hideModal={hideModal}
      isBackground
      isCloseButtom
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
          <EventColorOption
            colors={CALENDAR_COLOR}
            selectedColor={calendarColor}
            changeColor={(e, color) => setCalendarColor(color)}
          />
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
