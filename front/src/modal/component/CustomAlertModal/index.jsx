import React, { useRef } from 'react';
import styles from './style.module.css';
import Modal from '../../../components/common/Modal';
import PropTypes from 'prop-types';
import CustomAlertOfAllDay from '../../../components/alert/CustomAlertOfAllDay';
import CustomAlertOfNotAllDay from '../../../components/alert/CustomAlertOfNotAllDay';

import { useDispatch, useSelector } from 'react-redux';
import { newEventAllDaySelector } from '../../../store/selectors/newEvent';
import { EVENT } from '../../../store/events';
import { updateNewEventAlert } from '../../../store/newEvent';

const Index = ({ hideModal, modalData }) => {
  const { style, alertIndex } = modalData || {};
  const allDay = useSelector(newEventAllDaySelector);
  const alertRef = useRef();

  const dispatch = useDispatch();
  function handleAddAlert(e) {
    if (!alertRef.current.checkAlertTime()) return;
    dispatch(
      updateNewEventAlert({
        type: allDay ? 'allDay' : 'notAllDay',
        index: alertIndex,
        alert: alertRef.current.alert,
      }),
    );
    hideModal();
    e.stopPropagation();
  }

  return (
    <Modal
      hideModal={hideModal}
      isBackground
      backgroundColor="rgb(0, 0, 0, 0.5)"
      style={{
        ...style,
        top: 'calc(50% - 80px)',
        left: 'calc(50% - 100px)',
      }}
    >
      <div className={styles.modal_context}>
        <h1>맞춤 알림</h1>
        {allDay === EVENT.allDay.true ? (
          <CustomAlertOfAllDay ref={alertRef} />
        ) : (
          <CustomAlertOfNotAllDay ref={alertRef} />
        )}
        <div className={styles.modal_footer}>
          <button
            onClick={e => {
              hideModal();
              e.stopPropagation();
            }}
          >
            취소
          </button>
          <button onClick={handleAddAlert}>완료</button>
        </div>
      </div>
    </Modal>
  );
};
Index.propTypes = {
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
};

export default Index;
