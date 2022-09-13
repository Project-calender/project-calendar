import React, { useRef } from 'react';
import styles from './style.module.css';

import Modal from '../../../components/common/Modal';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const Index = ({ hideModal, modalData, onClickItem }) => {
  const {
    data = [],
    name,
    style,
    selectedItem,
    dataValues = [],
  } = modalData || {};

  const selectedItemRef = useRef();
  useEffect(() => {
    if (!selectedItemRef.current) return;
    const initList = setTimeout(() => {
      selectedItemRef.current.scrollIntoView({
        block: 'center',
        inline: 'start',
      });
      selectedItemRef.current.style.background = '#e6e8ec';
    }, 50);
    return () => clearTimeout(initList);
  });

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
          <div
            key={item}
            name={name}
            value={index}
            data-value={dataValues[index] || ''}
            {...(selectedItem === item && { ref: selectedItemRef })}
          >
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
