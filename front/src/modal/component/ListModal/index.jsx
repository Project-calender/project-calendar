import React from 'react';
import styles from './style.module.css';

import Modal from '../../../components/common/Modal';
import PropTypes from 'prop-types';

const Index = ({ hideModal, modalData }) => {
  const { data, style } = modalData || {};
  return (
    <Modal
      hideModal={hideModal}
      style={{
        zIndex: 600,
        borderRadius: 0,
        padding: '8px 0px',
        ...style,
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
