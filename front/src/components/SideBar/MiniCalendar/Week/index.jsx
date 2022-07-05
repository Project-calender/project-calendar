import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { selectDate } from '../../../../store/date';
import Moment from '../../../../utils/moment';
import { stateSelectedDate } from '../../../../store/selectors/date';

const Index = ({ week }) => {
  const selectedDate = useSelector(stateSelectedDate);
  const dispatch = useDispatch();

  return (
    <tr className={styles.calendar_tr}>
      {week.map((date, index) => (
        <td
          key={index}
          className={`${initDateClassName(date, selectedDate)}`}
          onClick={() => dispatch(selectDate(date.time))}
        >
          <em>{date.date}</em>
        </td>
      ))}
    </tr>
  );
};

function initDateClassName(date, selectedDate) {
  let className = '';
  const today = new Moment(new Date());
  if (isSameDate(date, today)) className = styles.date_today;
  else if (isSameDate(date, selectedDate)) className = styles.date_select;
  else if (isOtherMonth(date, selectedDate)) className = styles.date_blur;

  return className;
}

function isSameDate(date, otherDate) {
  return (
    date.year === otherDate.year &&
    date.month === otherDate.month &&
    date.date === otherDate.date
  );
}

function isOtherMonth(date, otherDate) {
  return date.month !== otherDate.month;
}

Index.propTypes = {
  week: PropTypes.array,
  selectedDate: PropTypes.object,
  setSelectedDate: PropTypes.func,
};

export default Index;
