import React from 'react';
import styles from './style.module.css';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { CreateCalendarModalContext } from '../../../context/EventModalContext';

import Tooltip from '../../common/Tooltip';

const Index = () => {
  const { showModal } = useContext(CreateCalendarModalContext);
  return (
    <div className={styles.calendar_icon} onClick={showModal}>
      <Tooltip title={'새 캘린더 추가'} top={18}>
        <FontAwesomeIcon icon={faPlus} className={styles.calendar_icon_plus} />
      </Tooltip>
    </div>
  );
};

export default Index;
