import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';
import { useEffect } from 'react';
import { useRef } from 'react';

const Index = ({
  children,
  hideModal,
  style = {},
  isCloseButtom = false,
  isBackground = false,
  backgroundColor = 'transform',
}) => {
  const $modal = useRef();
  useEffect(() => {
    document.addEventListener('click', clickModalOutside);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('click', clickModalOutside);
      document.body.style.overflow = 'auto';
    };
  });

  function clickModalOutside(event) {
    if (!$modal.current.contains(event.target)) {
      hideModal();
    }
  }

  return (
    <>
      {isBackground && (
        <div
          className={styles.modal_background}
          style={{ backgroundColor }}
          onWheel={e => e.stopPropagation()}
        />
      )}
      <div
        className={styles.modal_container}
        ref={$modal}
        style={style}
        onWheel={e => e.stopPropagation()}
      >
        {isCloseButtom && (
          <div className={styles.modal_close_icon}>
            <Tooltip title={'닫기'}>
              <FontAwesomeIcon icon={faXmark} onClick={hideModal} />
            </Tooltip>
          </div>
        )}
        <div className={styles.modal_contexts}>{children}</div>
      </div>
    </>
  );
};

Index.propTypes = {
  children: PropTypes.node,
  hideModal: PropTypes.func,
  style: PropTypes.object,
  isCloseButtom: PropTypes.bool,
  isBackground: PropTypes.bool,
  backgroundColor: PropTypes.string,
};
export default Index;
