import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { selectedDateSelector } from '../../../../../../store/selectors/date';
import useNavigateDayCalendar from '../../../../../../hooks/useNavigateDayCalendar';
import { selectDate } from '../../../../../../store/date';
import Moment from '../../../../../../utils/moment';
import styles from './style.module.css';

const Index = ({ month, date }) => {
  const selectedDate = useSelector(selectedDateSelector);
  const { moveDayCalendar } = useNavigateDayCalendar();
  // const showModal = useContext(EventListModalContext);

  const dispatch = useDispatch();
  function handleDate(date) {
    dispatch(selectDate(date));
    // dispatch(fetchCalendarsAndEvents(selectedDate.time, selectedDate.time));

    // fetchEvents().t;
    // showModal({
    //   date,
    //   events: events.map(event => ({ ...event, scale: 1 })),
    //   position: {
    //     top: top - 35,
    //     left: minLeft < left ? minLeft : left,
    //   },
    // });
  }

  return (
    <td
      className={`${initDateClassName(date, month, selectedDate)}`}
      onClick={() => handleDate(date)}
      onDoubleClick={() => moveDayCalendar(date)}
    >
      <em>{date.date}</em>
    </td>
  );
};

function initDateClassName(date, month, selectedDate) {
  let className = styles.calendar_td + ' ';
  if (isOtherMonth(date, month)) className += styles.date_blur;
  else if (isSameDate(date, new Moment())) className += styles.date_today;
  else if (isSameDate(date, selectedDate)) className += styles.date_select;

  return className;
}

function isSameDate(date, otherDate) {
  return date.time === otherDate.time;
}

function isOtherMonth(date, month) {
  return date.month !== month;
}

Index.propTypes = {
  month: PropTypes.number,
  date: PropTypes.object,
};

export default Index;
