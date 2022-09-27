import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

import Moment from '../../../../utils/moment';
import useNavigateDayCalendar from '../../../../hooks/useNavigateDayCalendar';
const Index = ({ dates = [] }) => {
  const isToday = date => date.time === new Moment().time;
  const { moveDayCalendar } = useNavigateDayCalendar();
  return (
    <div className={styles.calendar_header}>
      {dates.map(date => (
        <div key={date.time} className={`${isToday(date) ? styles.today : ''}`}>
          <em>{date.weekDay}</em>
          <p
            className={styles.calendar_header_date}
            onClick={() => {
              moveDayCalendar(date.toObject());
            }}
          >
            {date.date}
          </p>
        </div>
      ))}
    </div>
  );
};

Index.propTypes = {
  dates: PropTypes.array,
};

export default Index;
