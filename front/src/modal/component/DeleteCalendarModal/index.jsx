import React from 'react';
import styles from './style.module.css';

import Modal from '../../../components/common/Modal';
import { DeleteCalendarContext } from '../../../context/EventModalContext';
import { useContext } from 'react';

const Index = () => {
  const { hideModal, modalData } = useContext(DeleteCalendarContext);
  const { calendar } = modalData;

  return (
    <Modal
      hideModal={hideModal}
      style={{ ...modalData?.style }}
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
          <button>캘린더 삭제</button>
        </div>
      </div>
    </Modal>
  );
};

export default Index;
