import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { selectDate } from '../../../../store/date';

const Index = ({ week }) => {
  const selectedDate = useSelector(({ date }) => date.selectedDate);
  const dispatch = useDispatch();

  function initDateClassName(date) {
    let className = '';
    if (date.isToday()) className += styles.date_today;
    else if (date.month !== selectedDate.month) className += styles.date_blur;
    else if (date.time === selectedDate.time)
      className += styles.date_button_select;

    return className;
  }

  return (
    <tr className={styles.calendar_tr}>
      {week.map((date, index) => (
        <td
          key={index}
          className={`${initDateClassName(date)}`}
          onClick={() => dispatch(selectDate(date.time))}
        >
          <em>{date.date}</em>
        </td>
      ))}
    </tr>
  );
};

Index.propTypes = {
  week: PropTypes.array,
  selectedDate: PropTypes.object,
  setSelectedDate: PropTypes.func,
};

export default Index;
