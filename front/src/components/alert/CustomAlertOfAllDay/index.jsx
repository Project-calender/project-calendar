import React, { useRef } from 'react';
import styles from './style.module.css';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import Input from '../../common/Input';
import useEventModal from '../../../hooks/useEventModal';
import ListModal from '../../../modal/component/ListModal';
import TimeListModal from '../../../modal/component/TimeListModal';
import { useState } from 'react';
import Moment from '../../../utils/moment';
import { useImperativeHandle } from 'react';

const Index = React.forwardRef(({ alert, onChange = () => {} }, ref) => {
  const sendTypeModal = useEventModal();
  const dateTypeModal = useEventModal();
  const timeListModal = useEventModal();

  const [sendType, setSendType] = useState('알림');
  const [dateType, setDateType] = useState(alert?.type || '일');
  const [dateNumber, setDateNumber] = useState(alert ? alert.time : 1);
  const dateNumberRef = useRef();
  const [dateNumberErorr, setDateNumberError] = useState('');
  const [time, setTime] = useState(
    new Moment()
      .setHour(alert ? alert.hour : 9)
      .setMinute(alert ? alert.minute : 0).time,
  );

  useImperativeHandle(ref, () => ({
    alert: {
      type: dateType,
      time: dateNumber,
      hour: new Date(time).getHours(),
      minute: new Date(time).getMinutes(),
    },
    checkAlertTime: () => {
      if (!checkDateNumber(dateNumber)) {
        dateNumberRef.current.focus();
        return false;
      }
      return true;
    },
  }));

  function hideAllSubModal() {
    sendTypeModal.hideModal();
    dateTypeModal.hideModal();
    timeListModal.hideModal();
  }

  function onChangeNumber(e) {
    const number = +e.target.value;
    checkDateNumber(number);
    setDateNumber(number);
    onChange({ time: number });
  }

  function onChangeDateType(e) {
    const type = e.target.innerText;
    setDateType(type);
    setDateNumber(1);
    onChange({ type, time: 1 });
    dateTypeModal.hideModal();
    e.stopPropagation();
  }

  function onChangeDate(e) {
    e.stopPropagation();
    const time = +e.target.dataset.value;
    if (!time) return;
    setTime(time);
    onChange({
      hour: new Date(time).getHours(),
      minute: new Date(time).getMinutes(),
    });
    timeListModal.hideModal();
  }

  function checkDateNumber(number) {
    if (dateType === '분' && (number < 0 || number > 40320)) {
      setDateNumberError('0분에서 40320분 사이여야 합니다.');
    } else if (dateType === '시간' && (number < 0 || number > 672)) {
      setDateNumberError('0시간에서 672시간 사이여야 합니다.');
    } else if (dateType === '일' && (number < 0 || number > 28)) {
      setDateNumberError('0일에서 28일 사이여야 합니다.');
    } else if (dateType === '주' && (number < 0 || number > 4)) {
      setDateNumberError('0주에서 4주 사이여야 합니다.');
    } else {
      setDateNumberError('');
      return true;
    }
    return false;
  }

  return (
    <div className={styles.alert_options}>
      <div
        className={styles.send_modal_container}
        onClick={e => {
          hideAllSubModal();
          sendTypeModal.showModal({
            selectedItem: sendType,
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

      <div className={styles.alert_input_container}>
        <Input
          type="number"
          value={dateNumber}
          className={`${styles.alert_input_number} ${
            dateNumberErorr ? styles.error_input : ''
          }`}
          onChange={onChangeNumber}
          onFocus={() => checkDateNumber(dateNumber)}
          onBlur={() => setDateNumberError('')}
          ref={dateNumberRef}
        />

        {dateNumberErorr && (
          <div className={styles.error_message}>
            <div className={styles.square} />
            <p>{dateNumberErorr}</p>
          </div>
        )}
      </div>

      <div
        className={styles.date_modal_container}
        onClick={e => {
          hideAllSubModal();
          dateTypeModal.showModal({
            selectedItem: dateType,
            data: ['일', '주'],
          });
          onChange({ type: e.target.innerText });
          e.stopPropagation();
        }}
      >
        <h3>{dateType}</h3>
        <FontAwesomeIcon icon={faCaretDown} />

        {dateTypeModal.isModalShown && (
          <ListModal
            hideModal={dateTypeModal.hideModal}
            modalData={dateTypeModal.modalData}
            onClickItem={onChangeDateType}
          />
        )}
      </div>
      <h3>전</h3>

      <div
        className={styles.time_modal_container}
        onClick={e => {
          hideAllSubModal();
          timeListModal.showModal({
            selectedItem: new Moment(time).toTimeString(),
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
            onClickItem={onChangeDate}
            className={styles.time_modal}
          />
        )}
      </div>
    </div>
  );
});

Index.displayName = 'CustomAlertOfAllDay';

Index.propTypes = {
  alert: PropTypes.object,
  onChange: PropTypes.func,
};

export default Index;
