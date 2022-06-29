import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import PropTypes from 'prop-types';

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
        <button onClick={() => addMonth(-1)}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button onClick={() => addMonth(1)}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </div>
  );
};

Index.propTypes = {
  selectedDate: PropTypes.object,
  setSelectedDate: PropTypes.func,
};

export default Index;
