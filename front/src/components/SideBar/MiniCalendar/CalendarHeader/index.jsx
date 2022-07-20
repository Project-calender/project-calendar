import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../../common/Tooltip';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addMonth } from '../../../../store/date';

const Index = ({ year, month }) => {
  const dispatch = useDispatch();

  return (
    <div className={styles.year}>
      <div className={styles.text}>
        <em>{year}년</em>
        <em>{month}월</em>
      </div>
      <div className={styles.year_btt}>
        <Tooltip title="이전 달">
          <button onClick={() => dispatch(addMonth(-1))}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        </Tooltip>
        <Tooltip title="다음 달">
          <button onClick={() => dispatch(addMonth(1))}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

Index.propTypes = {
  year: PropTypes.number,
  month: PropTypes.number,
};

export default Index;
