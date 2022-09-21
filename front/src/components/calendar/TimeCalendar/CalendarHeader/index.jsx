import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

import Moment from '../../../../utils/moment';

const Index = ({ dates = [] }) => {
  const isToday = date => date.time === new Moment().time;

  return (
    <div className={styles.calendar_header}>
      {dates.map(date => (
        <div key={date.time} className={`${isToday(date) ? styles.today : ''}`}>
          <em>{date.weekDay}</em>
          <p>{date.date}</p>
        </div>
      ))}
    </div>
  );
};

Index.propTypes = {
  dates: PropTypes.array,
};

export default Index;
