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
  triggerDOM = '',
  style = {},
  isCloseButtom = false,
}) => {
  const $modal = useRef();
  useEffect(() => {
    document.addEventListener('click', clickModalOutside);
    return () => document.removeEventListener('click', clickModalOutside);
  });

  function clickModalOutside(event) {
    if (
      !$modal.current.contains(event.target) &&
      event.target.dataset?.modal !== triggerDOM
    ) {
      hideModal();
    }
  }

  return (
    <div className={styles.modal_container} ref={$modal} style={style}>
      {isCloseButtom && (
        <div className={styles.modal_close_icon}>
          <Tooltip title={'닫기'}>
            <FontAwesomeIcon icon={faXmark} onClick={hideModal} />
          </Tooltip>
        </div>
      )}
      <div className={styles.modal_contexts}>{children}</div>
    </div>
  );
};

Index.propTypes = {
  children: PropTypes.node,
  hideModal: PropTypes.func,
  triggerDOM: PropTypes.string,
  style: PropTypes.object,
  isCloseButtom: PropTypes.bool,
};
export default Index;
