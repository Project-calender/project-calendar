import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import ListModal from '../ListModal';
import Moment from '../../../utils/moment';

const Index = ({ hideModal, modalData, onClickItem = () => {}, className }) => {
  const { unit = 15, count = 15 * 96 } = modalData;
  const moment = new Moment();
  const times = [];
  for (let i = 0; i < count; i += unit) {
    times.push(moment.addMinute(i).toTimeString());
  }

  return (
    <div className={`${styles.modal_container} ${className}`}>
      <ListModal
        hideModal={hideModal}
        modalData={{ ...modalData, data: times, name: 'times' }}
        onClickItem={onClickItem}
      />
    </div>
  );
};

Index.propTypes = {
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
  onClickItem: PropTypes.func,
  className: PropTypes.string,
};

export default Index;
