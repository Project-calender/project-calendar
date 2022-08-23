import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EVENT } from '../../../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { newEventSelector } from '../../../../store/selectors/newEvent';
import { faCaretDown, faClose } from '@fortawesome/free-solid-svg-icons';
import { removeNewEvetnAlert } from '../../../../store/newEvent';
import Tooltip from '../../../../components/common/Tooltip';

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

  const dispatch = useDispatch();
  function clickRemoveAlert(e, index) {
    dispatch(
      removeNewEvetnAlert({
        type: newEvent.allDay === EVENT.allDay.true ? 'allDay' : 'notAllDay',
        index,
      }),
    );
    e.stopPropagation();
  }

  return (
    <>
      {alerts.map((alert, index) => (
        <div key={index} className={styles.alerts_container}>
          <h3
            className={styles.alert_item}
            onClick={e => showEventInfoListModal(e, message, `alert ${index}`)}
          >
            {newEvent.allDay === EVENT.allDay.true &&
              EVENT.alerts.getAllDayTitle(alert)}
            {newEvent.allDay === EVENT.allDay.false &&
              EVENT.alerts.getNotAllDayTitle(alert)}

            <FontAwesomeIcon
              className={styles.caret_down_icon}
              icon={faCaretDown}
            />
          </h3>
          <Tooltip title={'알림 삭제'}>
            <FontAwesomeIcon
              className={styles.close_icon}
              icon={faClose}
              onClick={e => clickRemoveAlert(e, index)}
            />
          </Tooltip>
        </div>
      ))}
    </>
  );
};

Index.propTypes = {
  showEventInfoListModal: PropTypes.func,
};

export default Index;
