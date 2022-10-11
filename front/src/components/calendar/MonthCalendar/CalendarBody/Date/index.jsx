import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import Moment from '../../../../../utils/moment';
import useNavigateDayCalendar from '../../../../../hooks/useNavigateDayCalendar';

import NewEvent from './NewEvent';
import EventList from './EventList';

import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { newEventBarByTimeSelector } from '../../../../../store/selectors/newEvent';

const Index = ({ date, month }) => {
  const { moveDayCalendar } = useNavigateDayCalendar();
  const containerDiv = useRef();
  const [maxHeight, setMaxHight] = useState(0);

  const newEventBar = useSelector(state =>
    newEventBarByTimeSelector(state, date.time),
  );

  const handleResize = useCallback(() => {
    const height = containerDiv.current?.clientHeight;
    if (height && maxHeight !== height) setMaxHight(height);
  }, [maxHeight, setMaxHight]);

  useEffect(() => {
    setMaxHight(containerDiv.current.clientHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, date]);

  return (
    <td className={initClassName(date)}>
      <em onClick={() => moveDayCalendar(date)}>{getTitleDate(date)}</em>
      <div
        className={styles.event_selection_container}
        name="event-drag-space"
        data-drag-date={date.time}
        ref={containerDiv}
      >
        {newEventBar && <NewEvent eventBar={newEventBar} />}
        <EventList date={date} maxHeight={maxHeight} month={month} />
        <div className={styles.event_list}></div>
      </div>
    </td>
  );
};

function getTitleDate(date) {
  return !isSameDate(date, new Moment()) && date.date === 1
    ? `${date.month}월 1일`
    : date.date;
}

function initClassName(date) {
  const className = styles.calendar_td + ' ';
  if (isSameDate(date, new Moment())) return className + styles.calendar_today;
  return className;
}

function isSameDate(date, otherDate) {
  return date.time === otherDate.time;
}

Index.propTypes = {
  date: PropTypes.object,
  month: PropTypes.array,
};

export default Index;
