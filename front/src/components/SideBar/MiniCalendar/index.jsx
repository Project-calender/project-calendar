import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader';
import CalendarBody from './CalendarBody';
import { miniCalendarContext } from '../../../context/EventModalContext';

const Index = ({ selectedDate, onClickDate }) => {
  const miniCalendarContextData = { selectedDate, onClickDate };
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
  onClickDate: PropTypes.func,
};
export default Index;
