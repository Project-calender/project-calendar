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
          {newEvent.allDay === EVENT.allDay.true &&
            EVENT.alerts.getAllDayTitle(alert)}
          {newEvent.allDay === EVENT.allDay.false &&
            EVENT.alerts.getNotAllDayTitle(alert)}

          <FontAwesomeIcon className={styles.caret_down} icon={faCaretDown} />
        </h3>
      ))}
    </>
  );
};

Index.propTypes = {
  showEventInfoListModal: PropTypes.func,
};

export default Index;
