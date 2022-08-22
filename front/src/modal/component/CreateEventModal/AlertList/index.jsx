import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EVENT } from '../../../../store/events';
import Moment from '../../../../utils/moment';
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
          {newEvent.allDay === EVENT.allDay.false &&
            `${alert.number}${alert.type} 전`}

          <FontAwesomeIcon className={styles.caret_down} icon={faCaretDown} />
        </h3>
      ))}
    </>
  );
};

function allDayTitle(alert) {
  const date =
    alert.number === 0
      ? '당일'
      : alert.type === '일' && alert.number === 1
      ? '전날'
      : `${alert.number}${alert.type} 전`;

  const moment = new Moment(alert.time);
  const time =
    moment.minute === 0
      ? `${moment.getTimeType()} ${moment.hour}시`
      : moment.toTimeString();

  return `${date} ${time}`;
}

Index.propTypes = {
  showEventInfoListModal: PropTypes.func,
};

export default Index;
