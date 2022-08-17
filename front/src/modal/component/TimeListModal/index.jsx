import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import ListModal from '../ListModal';
import Moment from '../../../utils/moment';

const Index = ({ hideModal, modalData }) => {
  const moment = new Moment();
  const times = [];
  for (let i = 0; i < 15 * 96; i += 15) {
    times.push(moment.addMinute(i).toTimeString());
  }
  return (
    <div className={styles.modal_container}>
      <ListModal
        hideModal={hideModal}
        modalData={{ ...modalData, data: times, name: 'times' }}
      />
    </div>
  );
};

Index.propTypes = {
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
};

export default Index;
