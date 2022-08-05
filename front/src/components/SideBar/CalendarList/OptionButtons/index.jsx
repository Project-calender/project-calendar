import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import Tooltip from '../../../common/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons';

import { useContext } from 'react';
import { ModalContext } from '../../../../context/EventModalContext';

const Index = ({ calendar }) => {
  const {
    showModal: showCalendarOptionModal,
    hideModal: hideCalendarOptionModal,
  } = useContext(ModalContext);
  return (
    <div
      className={styles.calendar_item_icon}
      onClick={e => {
        hideCalendarOptionModal();

        const { top, left } = e.currentTarget.getBoundingClientRect();
        showCalendarOptionModal({ calendar, style: { top, left: left + 50 } });
        e.stopPropagation();
      }}
    >
      {calendar.id > 0 && (
        <Tooltip title={'구독 취소'}>
          <FontAwesomeIcon icon={faXmark} className={styles.icon_mark} />
        </Tooltip>
      )}
      <Tooltip title={'옵션'}>
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          className={styles.icon_option}
        />
      </Tooltip>
    </div>
  );
};

Index.propTypes = {
  calendar: PropTypes.object,
};

export default Index;
