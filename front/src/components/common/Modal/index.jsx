import React, { useState } from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';
import { useEffect } from 'react';
import { useRef } from 'react';
import { throttle } from '../../../utils/delay';
import { useCallback } from 'react';
import { useMemo } from 'react';

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

  const [isMouseDown, setMouseDown] = useState(false);
  const pos = useMemo(() => ({ x: 0, y: 0 }), []);
  const moveModal = useCallback(e => {
    if (e.pageY === pos.y && e.pageX === pos.x) return;
    throttle(() => {
      const $modal = modalRef.current;
      $modal.style.top = $modal.offsetTop + (e.pageY - pos.y) + 'px';
      $modal.style.left = $modal.offsetLeft + (e.pageX - pos.x) + 'px';

      pos.x = e.pageX;
      pos.y = e.pageY;
    }, 100);
  }, []);

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
          onMouseUp={() => {
            modalBackgroundRef.current.removeEventListener(
              'mousemove',
              moveModal,
            );
            if (isMouseDown)
              setTimeout(() => {
                setMouseDown(false);
              }, 100);
          }}
        />
      )}
      <div
        className={styles.modal_container}
        ref={modalRef}
        name="modal"
        style={style}
        onWheel={e => e.stopPropagation()}
        onMouseDown={e => {
          if (e.target.getAttribute('name') === 'modal-move-trigger') {
            modalBackgroundRef.current.addEventListener('mousemove', moveModal);
            pos.x = e.pageX;
            pos.y = e.pageY;
            setMouseDown(true);
          }
        }}
        onMouseUp={() => {
          if (isMouseDown) setMouseDown(false);
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
