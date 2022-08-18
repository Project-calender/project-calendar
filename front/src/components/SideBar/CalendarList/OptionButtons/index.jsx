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
    showResignCalendarModal({
      calendar,
      style: {
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 150,
      },
    });
    e.stopPropagation();
  }

  function onClickOption(e) {
    hideCalendarOptionModal();

    const { top, left } = e.currentTarget.getBoundingClientRect();
    const maxTop = window.innerHeight - 260;
    showCalendarOptionModal({
      calendar,
      style: { top: top + 5 > maxTop ? maxTop : top + 5, left: left },
    });
    e.stopPropagation();
  }

  const isGroupCalendar = calendar.id > 0;
  return (
    <div
      className={`${styles.calendar_item_icon} ${
        calendar === calendarOptionData.calendar ? styles.show_icon : ''
      }`}
    >
      {isGroupCalendar && (
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
