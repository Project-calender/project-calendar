import React from 'react';
import styles from './style.module.css';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Input from '../../common/Input';
import useEventModal from '../../../hooks/useEventModal';
import ListModal from '../../../modal/component/ListModal';
import TimeListModal from '../../../modal/component/TimeListModal';
import { useState } from 'react';
import Moment from '../../../utils/moment';
import { useImperativeHandle } from 'react';

const Index = React.forwardRef((props, ref) => {
  const sendTypeModal = useEventModal();
  const dateTypeModal = useEventModal();
  const timeListModal = useEventModal();

  const [sendType, setSendType] = useState('알림');
  const [dateType, setDateType] = useState('일');
  const [number, setNumber] = useState(1);
  const [time, setTime] = useState(new Moment().setHour(9).time);

  useImperativeHandle(ref, () => ({
    alert: {
      type: dateType,
      time: number,
      hour: new Date(time).getHours(),
      minute: new Date(time).getMinutes(),
    },
  }));

  function hideAllSubModal() {
    sendTypeModal.hideModal();
    dateTypeModal.hideModal();
    timeListModal.hideModal();
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
      <Input
        type="number"
        value={number}
        className={styles.alert_input_number}
        onChange={e => setNumber(+e.target.value)}
      />
      <div
        className={styles.date_modal_container}
        onClick={e => {
          hideAllSubModal();
          dateTypeModal.showModal({
            data: ['일', '주'],
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
      <h3>전</h3>
      <div
        className={styles.time_modal_container}
        onClick={e => {
          hideAllSubModal();
          timeListModal.showModal({
            unit: 30,
            count: 30 * 48,
          });
          e.stopPropagation();
        }}
      >
        <Input
          value={new Moment(time).toTimeString()}
          className={styles.alert_input}
        />
        {timeListModal.isModalShown && (
          <TimeListModal
            hideModal={timeListModal.hideModal}
            modalData={timeListModal.modalData}
            onClickItem={e => {
              setTime(+e.target.dataset.value);
              timeListModal.hideModal();
              e.stopPropagation();
            }}
            className={styles.time_modal}
          />
        )}
      </div>
    </div>
  );
});

Index.displayName = 'CustomAlertOfAllDay';

export default Index;
