import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { selectedDateSelector } from '../../../../../../store/selectors/date';
import useNavigateDayCalendar from '../../../../../../hooks/useNavigateDayCalendar';
import { selectDate } from '../../../../../../store/date';
import Moment from '../../../../../../utils/moment';
import styles from './style.module.css';
import { fetchCalendarsAndEvents } from '../../../../../../store/thunk';
import { eventsByDateSelector } from '../../../../../../store/selectors/events';
import { triggerDOM } from '../../../../EventListModal';
import { EventListModalContext } from '../../../../../../context/EventModalContext';

const Index = ({ month, date }) => {
  const selectedDate = useSelector(selectedDateSelector);
  const { moveDayCalendar } = useNavigateDayCalendar();
  const { showModal, setModalData } = useContext(EventListModalContext);
  const events = useSelector(state => eventsByDateSelector(state, date));
  const dispatch = useDispatch();
  function handleDate(e, date) {
    dispatch(selectDate(date));
    dispatch(fetchCalendarsAndEvents(date.time, date.time));

    const {
      top: targetTop,
      left: targetLeft,
      bottom,
    } = e.target.getBoundingClientRect();
    const left = targetLeft + (e.target.tagName === 'EM' ? 30 : 38);
    const top = targetTop + (e.target.tagName === 'EM' ? 0 : 5) - 4;
    const minLeft = window.innerWidth / 2 + 100;

    showModal({
      date,
      events: [],
      position: {
        top: window.innerHeight < bottom + 150 ? null : top,
        left: minLeft < left ? left - 260 : left,
        bottom: window.innerHeight < bottom + 150 ? 30 : null,
      },
    });
  }

  useEffect(() => {
    if (!events || selectedDate.time !== date.time) return;
    setModalData(data => ({
      ...data,
      events: events?.map(event => ({ ...event, scale: 1 })),
    }));
  }, [events, selectedDate.time, date.time, setModalData]);

  return (
    <td
      className={`${initDateClassName(date, month, selectedDate)}`}
      onClick={e => handleDate(e, date)}
      onDoubleClick={() => moveDayCalendar(date)}
      data-modal={triggerDOM}
    >
      <em data-modal={triggerDOM}>{date.date}</em>
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
