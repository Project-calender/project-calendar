import React from 'react';
import styles from './style.module.css';

import Modal from '../../../components/common/Modal';
import EventColor from '../../../components/calendar/EventColor';
import { useContext } from 'react';
import { EventColorModalContext } from '../../../context/EventModalContext';

const Index = () => {
  const { hideModal, modalData, setModalData } = useContext(
    EventColorModalContext,
  );
  const { style, colors, selectedColor } = modalData;

  function onClickColor(e, color) {
    setModalData(data => ({ ...data, color }));
    hideModal(false);
    e.stopPropagation();
  }

  return (
    <Modal
      hideModal={hideModal}
      style={{
        ...style,
        zIndex: 600,
        borderRadius: 0,
        padding: '8px 0px 8px 8px',
      }}
    >
      <div className={styles.color_list} style={{ width: style.width || 55 }}>
        <EventColor
          colors={colors}
          selectedColor={selectedColor}
          onClickColor={onClickColor}
        />
      </div>
    </Modal>
  );
};

export default Index;
