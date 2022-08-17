import React from 'react';
import styles from './style.module.css';

import Modal from '../../../components/common/Modal';
import PropTypes from 'prop-types';

const Index = ({ hideModal, modalData, onClickItem }) => {
  const { data, name, style } = modalData || {};
  console.log(data);
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
      <div className={styles.list_items} onClick={onClickItem}>
        {data?.map((item, index) => (
          <div key={item} name={name} value={index}>
            {item}
          </div>
        ))}
      </div>
    </Modal>
  );
};
Index.propTypes = {
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
  onClickItem: PropTypes.func,
};

export default Index;
