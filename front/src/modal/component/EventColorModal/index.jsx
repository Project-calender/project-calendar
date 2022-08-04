import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../components/common/Modal';
import Tooltip from '../../../components/common/Tooltip';

const Index = ({ hideModal, modalData }) => {
  const { position, colors } = modalData;

  return (
    <Modal
      hideModal={hideModal}
      style={{
        ...position,
        zIndex: 600,
        borderRadius: 0,
        padding: '8px 0px 8px 8px',
      }}
    >
      <div className={styles.color_list}>
        {[...Object.entries(colors)].map(([name, color]) => (
          <Tooltip title={name} key={color}>
            <div
              className={styles.color_list_item}
              style={{ background: color }}
            />
          </Tooltip>
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
