import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../components/common/Modal';

const Index = ({ hideModal, modalData }) => {
  const { data, position } = modalData;
  return (
    <Modal
      hideModal={hideModal}
      style={{
        ...position,
        zIndex: 600,
        borderRadius: 0,
        padding: '8px 0px',
      }}
    >
      <div className={styles.list_items}>
        {data?.map(item => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </Modal>
  );
};

Index.propTypes = {
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
};

export default Index;
