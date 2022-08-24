import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './style.module.css';

import Modal from '../../../components/common/Modal';
import { ResignCalendarContext } from '../../../context/EventModalContext';
import { useContext } from 'react';
import { resignCalendar } from '../../../store/thunk/calendar';

const Index = () => {
  const { hideModal, modalData } = useContext(ResignCalendarContext);
  const { calendar } = modalData;

  const dispatch = useDispatch();
  function handleResignCalendar() {
    dispatch(resignCalendar(calendar.id));
    hideModal();
  }
  return (
    <Modal
      hideModal={hideModal}
      style={{
        top: 'calc(50% - 100px)',
        left: 'calc(50% - 100px)',
      }}
      isBackground
      backgroundColor="rgb(0, 0, 0, 0.5)"
    >
      <div className={styles.modal_container}>
        <p>
          <em>{calendar.name}</em>을(를) 삭제하시겠습니까? 더 이상 이 캘린더 및
          일정을 액세스할 수 없게 됩니다. 캘린더에 액세스할 수 있는 다른
          사용자는 계속 사용할 수 있습니다. <a>자세히 알아보기</a>
        </p>
        <div>
          <button onClick={hideModal}>취소</button>
          <button onClick={handleResignCalendar}>캘린더 삭제</button>
        </div>
      </div>
    </Modal>
  );
};

export default Index;
