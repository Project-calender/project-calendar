import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { selectedDateSelector } from '../../../../../../store/selectors/date';
import useNavigateDayCalendar from '../../../../../../hooks/useNavigateDayCalendar';
import { selectDate } from '../../../../../../store/date';
import Moment from '../../../../../../utils/moment';
import styles from './style.module.css';
import { getAllCalendarAndEvent } from '../../../../../../store/thunk/event';
import {
  EventDetailModalContext,
  EventListModalContext,
} from '../../../../../../context/EventModalContext';
import { useRef } from 'react';
import { isCheckedCalander } from '../../../../../../store/user';

const Index = ({ month, date }) => {
  const selectedDate = useSelector(selectedDateSelector);
  const { moveDayCalendar } = useNavigateDayCalendar();
  const { showModal: showEventListModal } = useContext(EventListModalContext);
  const { hideModal: hideEventDetailModal } = useContext(
    EventDetailModalContext,
  );

  const $date = useRef();
  const dispatch = useDispatch();

  function handleDate(e, date) {
    dispatch(selectDate(date));
    dispatch(
      getAllCalendarAndEvent({ startTime: date.time, endTime: date.time }),
    ).then(({ payload }) => {
      const { top, left } = $date.current.getBoundingClientRect();
      const minLeft = window.innerWidth / 2 + 100;
      showEventListModal({
        date,
        events: payload.events.filter(isCheckedCalander),
        style: { top, left: minLeft < left ? left - 222 : left + 35 },
      });
      hideEventDetailModal();
    });

    e.stopPropagation();
  }

  return (
    <td
      className={`${initDateClassName(date, month, selectedDate)}`}
      onClick={e => handleDate(e, date)}
      onDoubleClick={() => moveDayCalendar(date)}
      ref={$date}
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
