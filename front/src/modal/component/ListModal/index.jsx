import React, { useContext } from 'react';
import styles from './style.module.css';

import Modal from '../../../components/common/Modal';
import { ListModalContext } from '../../../context/EventModalContext';

const Index = () => {
  const { hideModal, modalData } = useContext(ListModalContext);
  const { data, style } = modalData;
  return (
    <Modal
      hideModal={hideModal}
      style={{
        ...style,
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

export default Index;
