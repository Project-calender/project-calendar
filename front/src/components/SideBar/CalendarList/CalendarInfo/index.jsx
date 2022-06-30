import React from 'react';
<<<<<<< HEAD
import styles from './style.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons';

import PropTypes from 'prop-types';
import Tooltip from '../../../common/Tooltip';

const Index = ({ calendar, remove = true }) => {
  return (
    <div className={styles.calendarInfo}>
      <label>
        <input type="checkbox" />
        <Tooltip key={calendar.id} title={calendar.calendarName}>
          <p>{calendar.calendarName}</p>
        </Tooltip>
      </label>
      <div className={styles.calendarInfo_icon}>
        {remove && (
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
=======
import styles_calendar from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ calendars }) => {
  return (
    <>
      {calendars.map(({ id, calendarName }) => (
        <label key={id} className={styles_calendar.calendarInfo_label}>
          <input type="checkbox" /> {calendarName}
        </label>
      ))}
    </>
>>>>>>> origin/develop
  );
};

Index.propTypes = {
<<<<<<< HEAD
  calendar: PropTypes.object,
  remove: PropTypes.bool,
=======
  calendars: PropTypes.array,
>>>>>>> origin/develop
};

export default Index;
