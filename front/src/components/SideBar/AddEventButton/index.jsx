import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

import useEventModal from '../../../hooks/useEventModal';
import AddEventButtonModal from '../../../modal/component/AddEventButtonModal';

const Index = () => {
  const {
    showModal: showAddEventButtonModal,
    isModalShown,
    hideModal,
    modalData,
  } = useEventModal();

  function onClick(e) {
    const { left, top } = e.currentTarget.getBoundingClientRect();

    showAddEventButtonModal({
      data: ['이벤트', '할 일'],
      style: { top: top + 60, left: left + 12 },
    });
    e.stopPropagation();
  }

  return (
    <>
      {isModalShown && (
        <AddEventButtonModal hideModal={hideModal} modalData={modalData} />
      )}
      <button
        className={`${styles.event_btn} ${isModalShown ? styles.clicked : ''}`}
        onClick={onClick}
      >
        <img
          src={`${process.env.PUBLIC_URL}/img/side_bar_plus.png`}
          className={styles.event_img_plus}
          alt="addEventIcon"
        />
        <em>만들기</em>
        <FontAwesomeIcon
          icon={faCaretDown}
          className={styles.event_icon_caret}
        />
      </button>
    </>
  );
};

Index.propTypes = {
  closeSideBar: PropTypes.func,
};
export default Index;
