import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';
import { useEffect } from 'react';
import { useRef } from 'react';
import useDraggable from '../../../hooks/useDraggable';

const Index = ({
  children,
  hideModal,
  style = {},
  isCloseButtom = false,
  isBackground = false,
  backgroundColor = 'transform',
}) => {
  const modalRef = useRef();
  const modalBackgroundRef = useRef();

  const { isMouseDown, readyMoveElement, stopMoveElement } = useDraggable(
    modalRef,
    modalBackgroundRef,
  );

  useEffect(() => {
    document.addEventListener('click', clickModalOutside);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('click', clickModalOutside);
      document.body.style.overflow = 'auto';
    };
  });

  function clickModalOutside(event) {
    if (!isMouseDown && !modalRef.current.contains(event.target)) {
      hideModal();
    }
  }

  return (
    <>
      {isBackground && (
        <div
          className={`${styles.modal_background} ${
            isMouseDown ? styles.max_zIndex : ''
          }`}
          style={{ backgroundColor }}
          onWheel={e => e.stopPropagation()}
          ref={modalBackgroundRef}
          onMouseUp={stopMoveElement}
        />
      )}
      <div
        className={styles.modal_container}
        ref={modalRef}
        name="modal"
        style={style}
        onWheel={e => e.stopPropagation()}
        onMouseDown={e => {
          if (e.target.getAttribute('name') !== 'modal-move-trigger') return;
          readyMoveElement(e);
        }}
      >
        {isCloseButtom && (
          <div className={styles.modal_close_icon}>
            <Tooltip title={'닫기'}>
              <FontAwesomeIcon icon={faXmark} onClick={hideModal} />
            </Tooltip>
          </div>
        )}
        {children}
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
