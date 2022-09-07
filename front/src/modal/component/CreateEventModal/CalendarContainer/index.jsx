import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EventColorOption from '../../../../components/calendar/EventColorOption';

import { useDispatch, useSelector } from 'react-redux';
import { newEventSelector } from '../../../../store/selectors/newEvent';
import { EVENT_COLOR } from '../../../../styles/color';
import { updateNewEventBarProperties } from '../../../../store/newEvent';
import { calendarsByWriteAuthoritySelector } from '../../../../store/selectors/calendars';

const Index = ({ showListModal }) => {
  const newEvent = useSelector(newEventSelector);
  const calendars = useSelector(calendarsByWriteAuthoritySelector);

  const dispatch = useDispatch();
  const changeColor = (e, color) => {
    dispatch(updateNewEventBarProperties({ eventColor: color }));
  };

  const colors = Object.values(EVENT_COLOR).includes(newEvent.calendarColor)
    ? EVENT_COLOR
    : { ...EVENT_COLOR, '캘린더 색상': newEvent.calendarColor };

  return (
    <div className={styles.calendar_container}>
      <h3
        onClick={e =>
          showListModal(e, {
            data: calendars.map(calendar => calendar.name),
            name: 'calendarId',
            selectedItem: calendars[newEvent.calendarId].name,
          })
        }
      >
        {calendars[newEvent.calendarId].name}
        <FontAwesomeIcon className={styles.caret_down} icon={faCaretDown} />
      </h3>
      <EventColorOption
        colors={colors}
        selectedColor={newEvent.eventColor || newEvent.calendarColor}
        changeColor={changeColor}
      />
    </div>
  );
};

Index.propTypes = {
  showListModal: PropTypes.func,
};

export default Index;
