import React from 'react';
import styles from './style.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons';

import PropTypes from 'prop-types';
import Tooltip from '../../../common/Tooltip';

const Index = ({ calendar }) => {
  return (
    <div className={styles.calendarInfo}>
      <label>
        <input type="checkbox" />
        <Tooltip key={calendar.id} title={calendar.calendarName}>
          <p>{calendar.calendarName}</p>
        </Tooltip>
      </label>

      <div className={styles.calendarInfo_icon}>
        {calendar.type !== 'private' && (
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
    </div>
  );
};

Index.propTypes = {
  calendar: PropTypes.object,
  remove: PropTypes.bool,
};

export default Index;
