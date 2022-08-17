import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import Modal from '../../../components/common/Modal';
import MiniCalendar from '../../../components/SideBar/MiniCalendar';

const Index = ({ hideModal, modalData }) => {
  const { selectedDate, style } = modalData;
  return (
    <Modal hideModal={hideModal} style={{ ...style, borderRadius: 0 }}>
      <div className={styles.modal_container}>
        <MiniCalendar selectedDate={selectedDate} />
      </div>
    </Modal>
  );
};

Index.propTypes = {
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
};

export default Index;
