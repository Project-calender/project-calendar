import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader';
import CalendarBody from './CalendarBody';
import { miniCalendarContext } from '../../../context/EventModalContext';

const Index = ({
  selectedDate,
  calendarDate,
  setCalendarDate,
  onClickDate,
  onClickNextMonth = () => {},
  onClickPreviousMonth = () => {},
}) => {
  const miniCalendarContextData = {
    selectedDate,
    calendarDate,
    setCalendarDate,
    onClickDate,
    onClickNextMonth,
    onClickPreviousMonth,
  };

  return (
    <miniCalendarContext.Provider value={miniCalendarContextData}>
      <div className={styles.calendar_wrap}>
        <CalendarHeader />
        <CalendarBody />
      </div>
    </miniCalendarContext.Provider>
  );
};

Index.propTypes = {
  selectedDate: PropTypes.object,
  calendarDate: PropTypes.object,
  setCalendarDate: PropTypes.func,
  onClickDate: PropTypes.func,
  onClickNextMonth: PropTypes.func,
  onClickPreviousMonth: PropTypes.func,
};
export default Index;
