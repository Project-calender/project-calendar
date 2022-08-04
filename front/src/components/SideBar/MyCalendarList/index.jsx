import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import CalendarList from '../CalendarList';
import CreateCalendarModal from '../../../modal/component/CreateCalendarModal';
import Tooltip from '../../common/Tooltip';

import { useSelector } from 'react-redux';
import { myCalendarSelector } from '../../../store/selectors/calendars';
import useEventModal from '../../../hooks/useEventModal';

const Index = () => {
  const calendars = useSelector(myCalendarSelector);
  const { isModalShown, hideModal, showModal, modalData } = useEventModal();
  function showCreateCalendarModal(e) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    showModal({ style: { top, left: left + 40 } });
    e.stopPropagation();
  }
  return (
    <div className={styles.calendar}>
      {isModalShown && (
        <CreateCalendarModal hideModal={hideModal} modalData={modalData} />
      )}

      <CalendarList title={'내 캘린더'} calendars={calendars} />

      <div className={styles.calendar_icon} onClick={showCreateCalendarModal}>
        <Tooltip title={'새 캘린더 추가'} top={18}>
          <FontAwesomeIcon
            icon={faPlus}
            className={styles.calendar_icon_plus}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Index;
