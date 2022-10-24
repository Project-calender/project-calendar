import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import Tooltip from '../../../common/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons';

import { useContext } from 'react';
import {
  ResignCalendarContext,
  CalendarOptionContext,
} from '../../../../context/EventModalContext';

const Index = ({ calendar }) => {
  const {
    showModal: showCalendarOptionModal,
    hideModal: hideCalendarOptionModal,
    modalData: calendarOptionData,
  } = useContext(CalendarOptionContext);

  const { showModal: showResignCalendarModal } = useContext(
    ResignCalendarContext,
  );

  function onClickCancel(e) {
    showResignCalendarModal({ calendar });
    e.stopPropagation();
  }

  function onClickOption(e) {
    hideCalendarOptionModal();

    const { top, left } = e.currentTarget.getBoundingClientRect();
    const maxTop = window.innerHeight - 260;
    showCalendarOptionModal({
      calendar,
      style: { top: top > maxTop ? maxTop : top, left: left },
    });
    e.stopPropagation();
  }

  return (
    <div
      className={`${styles.calendar_item_icon} ${
        calendar === calendarOptionData.calendar ? styles.show_icon : ''
      }`}
    >
      {!calendar.private && (
        <Tooltip title={'구독 취소'}>
          <FontAwesomeIcon
            icon={faXmark}
            className={styles.icon_mark}
            onClick={onClickCancel}
          />
        </Tooltip>
      )}
      <div className={styles.space} />
      <Tooltip title={'옵션'}>
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          className={styles.icon_option}
          onClick={onClickOption}
        />
      </Tooltip>
    </div>
  );
};

Index.propTypes = {
  calendar: PropTypes.object,
};

export default Index;
