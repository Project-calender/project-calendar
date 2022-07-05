import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import CalendarBody from './CalendarBody';

const Index = ({ year, month }) => {
  return (
    <div className={styles.month_calendar}>
      <p>{month}월</p>
      <CalendarBody year={year} month={month} />
    </div>
  );
};

Index.propTypes = {
  year: PropTypes.number,
  month: PropTypes.number,
};

export default Index;
