import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import Modal from '../../../components/common/Modal';
import EventColor from '../../../components/calendar/EventColor';

const Index = ({
  colors,
  selectedColor,
  onClickColor,
  hideModal,
  modalData,
}) => {
  const { style } = modalData;

  function handleClickColor(e, color) {
    onClickColor(e, color);
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
      <div className={styles.color_list} style={{ width: style?.width || 55 }}>
        <EventColor
          colors={colors}
          selectedColor={selectedColor}
          onClickColor={handleClickColor}
        />
      </div>
    </Modal>
  );
};
Index.propTypes = {
  colors: PropTypes.object,
  selectedColor: PropTypes.string,
  onClickColor: PropTypes.func,
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
};

export default Index;
