import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import AlertList from './AlertList';
import { useDispatch, useSelector } from 'react-redux';
import { newEventSelector } from '../../../../store/selectors/newEvent';
import { EVENT } from '../../../../store/events';
import {
  addNewEventAllDayAlert,
  addNewEventNotAllDayAlert,
} from '../../../../store/newEvent';

const Index = ({ showListModal }) => {
  const newEvent = useSelector(newEventSelector);

  const dispatch = useDispatch();
  function clickAddAlert(e) {
    if (newEvent.allDay === EVENT.allDay.true) {
      dispatch(
        addNewEventAllDayAlert({ type: '일', time: 1, hour: 9, minute: 0 }),
      );
    } else {
      dispatch(addNewEventNotAllDayAlert({ type: '분', time: 30 }));
    }
    e.stopPropagation();
  }

  return (
    <div>
      <AlertList showListModal={showListModal} />
      {(newEvent.allDay === EVENT.allDay.true
        ? newEvent.alerts.allDay
        : newEvent.alerts.notAllDay
      ).length < 5 && (
        <h4 className={styles.alert_button} onClick={clickAddAlert}>
          알림 추가
        </h4>
      )}
    </div>
  );
};

Index.propTypes = {
  showListModal: PropTypes.func,
};

export default Index;
