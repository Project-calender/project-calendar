import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EVENT } from '../../../../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { newEventSelector } from '../../../../../store/selectors/newEvent';
import { faCaretDown, faClose } from '@fortawesome/free-solid-svg-icons';
import { removeNewEvetnAlert } from '../../../../../store/newEvent';
import Tooltip from '../../../../../components/common/Tooltip';

const Index = ({ showListModal }) => {
  const newEvent = useSelector(newEventSelector);

  const alerts =
    newEvent.allDay === EVENT.allDay.true
      ? newEvent.alerts.allDay
      : newEvent.alerts.notAllDay;

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

  const getAlertTitle =
    newEvent.allDay === EVENT.allDay.true
      ? EVENT.alerts.getAllDayTitle
      : EVENT.alerts.getNotAllDayTitle;

  function clickAlert(e, alert, index) {
    const alerts =
      newEvent.allDay === EVENT.allDay.true
        ? EVENT.alerts.allDay.values
        : EVENT.alerts.notAllDay.values;

    const newAlerts = [
      ...new Map(
        alerts.concat(alert).map(alert => [getAlertTitle(alert), alert]),
      ).values(),
    ]
      .sort(EVENT.alerts.ASC_SORT)
      .map(getAlertTitle);

    showListModal(e, {
      data: newAlerts,
      name: `alert ${index}`,
      selectedItem: getAlertTitle(alert),
    });
    e.stopPropagation();
  }
  return (
    <>
      {alerts.map((alert, index) => (
        <div key={index} className={styles.alerts_container}>
          <h3
            className={styles.alert_item}
            onClick={e => clickAlert(e, alert, index)}
          >
            {getAlertTitle(alert)}
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
  showListModal: PropTypes.func,
};

export default Index;
