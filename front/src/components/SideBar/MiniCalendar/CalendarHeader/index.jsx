import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import Tooltip from '../../../common/Tooltip';

const Index = ({ selectedDate, setSelectedDate }) => {
  function addMonth(number) {
    setSelectedDate(preDate => {
      const date = new Date(preDate.getTime());
      date.setMonth(date.getMonth() + number);
      return date;
    });
  }

  return (
    <div className={styles.year}>
      <div className={styles.text}>
        <em>{selectedDate.getFullYear()}년</em>
        <em>{selectedDate.getMonth() + 1}월</em>
      </div>
      <div className={styles.year_btt}>
        <Tooltip title="이전 달">
          <button onClick={() => addMonth(-1)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        </Tooltip>
        <Tooltip title="다음 달">
          <button onClick={() => addMonth(1)}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

Index.propTypes = {
  selectedDate: PropTypes.object,
  setSelectedDate: PropTypes.func,
};

export default Index;
