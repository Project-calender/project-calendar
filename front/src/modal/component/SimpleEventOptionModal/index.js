import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../components/common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import EventColor from '../../../components/calendar/EventColor';
import { EVENT_COLOR } from '../../../styles/color';
const Index = ({ hideModal, modalData }) => {
  return (
    <Modal
      hideModal={hideModal}
      style={{ ...modalData.style, borderRadius: 0, padding: 0 }}
    >
      <div className={styles.modal_container}>
        <ul>
          <li className={styles.delete_event}>
            <FontAwesomeIcon icon={faTrashCan} />
            <em>삭제</em>
          </li>
        </ul>
        <hr />
        <div className={styles.event_color}>
          <EventColor colors={EVENT_COLOR} />
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
