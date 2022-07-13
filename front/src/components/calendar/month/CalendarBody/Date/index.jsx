import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import Moment from '../../../../../utils/moment';
import useNavigateDayCalendar from '../../../../../hooks/useNavigateDayCalendar';
// import { useSelector } from 'react-redux';
// import { selectEventByTime } from '../../../../../store/selectors/events';

import NewEvent from './NewEvent';
import EventList from './EventList';

const Index = ({ date }) => {
  const { moveDayCalendar } = useNavigateDayCalendar();
  // const event = useSelector(state => selectEventByTime(state, date.time));

  return (
    <td className={initClassName(date)}>
      <em onClick={() => moveDayCalendar(date)}>{getTitleDate(date)}</em>
      <div
        className={styles.event_selection_container}
        data-date-id={date.time}
      >
        <NewEvent dateTime={date.time} />
        <EventList />
        <div className={styles.event_list}></div>
      </div>
    </td>
  );
};

function getTitleDate(date) {
  return date.date === 1 ? `${date.month}월 1일` : date.date;
}

function initClassName(date) {
  let className = styles.calendar_td + ' ';
  if (isSameDate(date, new Moment())) className += styles.calendar_today;

  return className;
}

function isSameDate(date, otherDate) {
  return date.time === otherDate.time;
}

Index.propTypes = {
  date: PropTypes.object,
};

export default Index;
