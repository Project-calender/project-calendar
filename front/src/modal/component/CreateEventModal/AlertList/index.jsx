import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EVENT } from '../../../../store/events';
import { useSelector } from 'react-redux';
import { newEventSelector } from '../../../../store/selectors/newEvent';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const Index = ({ showEventInfoListModal }) => {
  const newEvent = useSelector(newEventSelector);

  const alerts =
    newEvent.allDay === EVENT.allDay.true
      ? newEvent.alerts.allDay
      : newEvent.alerts.notAllDay;

  const message =
    newEvent.allDay === EVENT.allDay.true
      ? EVENT.alerts.allDay.message
      : EVENT.alerts.notAllDay.message;

  return (
    <>
      {alerts.map((alert, index) => (
        <h3
          key={index}
          className={styles.list_modal}
          onClick={e => showEventInfoListModal(e, message, `alert ${index}`)}
        >
          {newEvent.allDay === EVENT.allDay.true && allDayTitle(alert)}
          {newEvent.allDay === EVENT.allDay.false && notAllDayTitle(alert)}

          <FontAwesomeIcon className={styles.caret_down} icon={faCaretDown} />
        </h3>
      ))}
    </>
  );
};

function allDayTitle(alert) {
  const date =
    alert.time === 0
      ? '당일'
      : alert.type === '일' && alert.time === 1
      ? '전날'
      : `${alert.time}${alert.type} 전`;

  const type = alert.hour < 12 ? '오전' : '오후';
  const hour = (alert.hour > 12 ? alert.hour % 12 : alert.hour) || 12;
  const time =
    alert.minute === 0
      ? `${type} ${hour}시`
      : `${type} ${hour}:${alert.minute}`;

  return `${date} ${time}`;
}

function notAllDayTitle(alert) {
  return `${alert.time}${alert.type} 전`;
}

Index.propTypes = {
  showEventInfoListModal: PropTypes.func,
};

export default Index;
