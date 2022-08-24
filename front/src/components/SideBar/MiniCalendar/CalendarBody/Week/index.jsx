import React, { useContext } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Moment from '../../../../../utils/moment';
import { miniCalendarContext } from '../../../../../context/EventModalContext';

const Index = ({ week, month }) => {
  const { selectedDate, onClickDate } = useContext(miniCalendarContext);

  return (
    <tr className={styles.calendar_tr}>
      {week.map((date, index) => (
        <td
          key={index}
          className={`${initDateClassName(date, month, selectedDate)}`}
          onClick={e => onClickDate(e, date)}
        >
          <em>{date.date}</em>
        </td>
      ))}
    </tr>
  );
};

function initDateClassName(date, month, selectedDate) {
  let className = '';
  if (isOtherMonth(date, month)) className = styles.date_blur;
  else if (isSameDate(date, new Moment())) className = styles.date_today;
  else if (isSameDate(date, selectedDate)) className = styles.date_select;

  return className;
}

function isSameDate(date, otherDate) {
  return date.time === otherDate.time;
}

function isOtherMonth(date, month) {
  return date.month !== month;
}

Index.propTypes = {
  week: PropTypes.array,
  month: PropTypes.number,
};

export default Index;
