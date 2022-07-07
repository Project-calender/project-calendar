import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import Moment from '../../../../../utils/moment';
import { useDispatch } from 'react-redux';
import { selectDate } from '../../../../../store/date';
import { useNavigate } from 'react-router-dom';
import { CALENDAR_URL } from '../../../../../constants/path';

const Index = ({ date }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function moveDayCalendarPage(date) {
    dispatch(selectDate(date));
    navigate(CALENDAR_URL.DAY);
  }

  return (
    <td className={initClassName(date)}>
      <em onClick={() => moveDayCalendarPage(date)}>
        {date.date === 1 ? `${date.month}월 1일` : date.date}
      </em>
    </td>
  );
};

function initClassName(date) {
  let className = styles.calendar_td + ' ';
  const today = new Moment(new Date());
  if (isSameDate(date, today)) className += styles.calendar_today;

  return className;
}

function isSameDate(date, otherDate) {
  return (
    date.year === otherDate.year &&
    date.month === otherDate.month &&
    date.date === otherDate.date
  );
}

Index.propTypes = {
  date: PropTypes.object,
};

export default Index;
