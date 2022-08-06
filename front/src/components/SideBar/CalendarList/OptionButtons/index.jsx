import React from 'react';
import styles from './style.module.css';
import rootStyles from '../../../../styles/style.module.css';
import PropTypes from 'prop-types';

import Tooltip from '../../../common/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons';

import { useContext } from 'react';
import { ModalContext } from '../../../../context/EventModalContext';
import { useRef } from 'react';

const Index = ({ calendar }) => {
  const {
    showModal: showCalendarOptionModal,
    hideModal: hideCalendarOptionModal,
    modalData: CalendarOptionData,
  } = useContext(ModalContext);

  function onCLickOption(e) {
    hideCalendarOptionModal();
    const { target: previousIcons } = CalendarOptionData;
    const icons = [...iconsRef.current.getElementsByTagName('svg')];

    previousIcons?.forEach(icon => icon.classList.remove(rootStyles.show_icon));
    icons.forEach(icon => icon.classList.add(rootStyles.show_icon));

    const { top, left } = e.currentTarget.getBoundingClientRect();
    showCalendarOptionModal({
      calendar,
      style: { top, left: left + 20 },
      target: icons,
    });
    e.stopPropagation();
  }

  const iconsRef = useRef();
  const isGroupCalendar = calendar.id > 0;
  return (
    <div className={styles.calendar_item_icon} ref={iconsRef}>
      {isGroupCalendar ? (
        <Tooltip title={'구독 취소'}>
          <FontAwesomeIcon icon={faXmark} className={styles.icon_mark} />
        </Tooltip>
      ) : (
        <div />
      )}
      <Tooltip title={'옵션'}>
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          className={styles.icon_option}
          onClick={onCLickOption}
        />
      </Tooltip>
    </div>
  );
};

Index.propTypes = {
  calendar: PropTypes.object,
};

export default Index;
