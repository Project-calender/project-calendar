import React from 'react';
import styles from './style.module.css';

import Modal from '../../../components/common/Modal';
import Tooltip from '../../../components/common/Tooltip';
import { useContext } from 'react';
import { EventColorModalContext } from '../../../context/EventModalContext';

const Index = () => {
  const { hideModal, modalData, setModalData } = useContext(
    EventColorModalContext,
  );
  const { style, colors } = modalData;

  function clickColor(e, calendarColor) {
    setModalData(data => ({ ...data, calendarColor }));
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
        {[...Object.entries(colors)].map(([name, color]) => (
          <Tooltip title={name} key={color}>
            <div
              className={styles.color_list_item}
              style={{ background: color }}
              onClick={e => clickColor(e, color)}
            />
          </Tooltip>
        ))}
      </div>
    </Modal>
  );
};

export default Index;
