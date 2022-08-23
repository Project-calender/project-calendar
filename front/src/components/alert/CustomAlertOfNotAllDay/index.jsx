import React, { useState } from 'react';
import styles from './style.module.css';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Input from '../../common/Input';
import useEventModal from '../../../hooks/useEventModal';
import ListModal from '../../../modal/component/ListModal';

const Index = () => {
  const sendTypeModal = useEventModal();
  const dateTypeModal = useEventModal();

  const [sendType, setSendType] = useState('알림');
  const [dateType, setDateType] = useState('일');

  function hideAllSubModal() {
    sendTypeModal.hideModal();
    dateTypeModal.hideModal();
  }
  return (
    <div className={styles.alert_options}>
      <div
        className={styles.send_modal_container}
        onClick={e => {
          hideAllSubModal();
          sendTypeModal.showModal({
            data: ['이메일', '알림'],
          });
          e.stopPropagation();
        }}
      >
        <h3>{sendType}</h3>
        <FontAwesomeIcon icon={faCaretDown} />
        {sendTypeModal.isModalShown && (
          <ListModal
            hideModal={sendTypeModal.hideModal}
            modalData={sendTypeModal.modalData}
            onClickItem={e => {
              setSendType(e.target.innerText);
              sendTypeModal.hideModal();
              e.stopPropagation();
            }}
          />
        )}
      </div>
      <Input type="number" defaultValue={1} className={styles.alert_input} />
      <div
        className={styles.date_modal_container}
        onClick={e => {
          hideAllSubModal();
          dateTypeModal.showModal({
            data: ['분', '시간', '일', '주'],
          });
          e.stopPropagation();
        }}
      >
        <h3>{dateType}</h3>
        <FontAwesomeIcon icon={faCaretDown} />
        {dateTypeModal.isModalShown && (
          <ListModal
            hideModal={dateTypeModal.hideModal}
            modalData={dateTypeModal.modalData}
            onClickItem={e => {
              setDateType(e.target.innerText);
              dateTypeModal.hideModal();
              e.stopPropagation();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
