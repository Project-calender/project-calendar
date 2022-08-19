import React, { useContext } from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../../common/Tooltip';
import { miniCalendarContext } from '../../../../context/EventModalContext';

const Index = () => {
  const {
    calendarDate,
    setCalendarDate,
    onClickNextMonth,
    onClickPreviousMonth,
  } = useContext(miniCalendarContext);
  const [year, month] = [calendarDate.year, calendarDate.month];

  return (
    <div className={styles.year}>
      <div className={styles.text}>
        <em>{year}년</em>
        <em>{month}월</em>
      </div>
      <div className={styles.year_btt}>
        <Tooltip title="이전 달">
          <button
            onClick={e => {
              onClickPreviousMonth(e);
              setCalendarDate(calendarDate.addMonth(-1));
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        </Tooltip>
        <Tooltip title="다음 달">
          <button
            onClick={e => {
              onClickNextMonth(e);
              setCalendarDate(calendarDate.addMonth(1));
            }}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Index;
