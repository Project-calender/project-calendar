import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { newEventSelector } from '../../../../store/selectors/newEvent';
import { calendarsByWriteAuthoritySelector } from '../../../../store/selectors/calendars';
import { EVENT } from '../../../../store/events';

const Index = ({ setAddCalendar }) => {
  const newEvent = useSelector(newEventSelector);
  const calendars = useSelector(calendarsByWriteAuthoritySelector);

  const previewTitle = `${EVENT.busy[newEvent.busy]} · ${
    EVENT.permission[newEvent.permission]
  } · 알리지 않음`;

  return (
    <div
      className={styles.calendar_title}
      onClick={e => {
        setAddCalendar(true);
        e.stopPropagation();
      }}
    >
      <h4>{calendars[newEvent.calendarId].name}</h4>
      <div
        className={styles.calendar_color}
        style={{ background: newEvent.calendarColor }}
      />
      <h5>{previewTitle}</h5>
    </div>
  );
};

Index.propTypes = {
  setAddCalendar: PropTypes.func,
};

export default Index;
