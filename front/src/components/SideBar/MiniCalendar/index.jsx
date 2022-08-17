import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import CalendarHeader from './CalendarHeader';
import CalendarBody from './CalendarBody';
import { miniCalendarContext } from '../../../context/EventModalContext';

const Index = ({ selectedDate }) => {
  return (
    <miniCalendarContext.Provider value={selectedDate}>
      <div className={styles.calendar_wrap}>
        <CalendarHeader />
        <CalendarBody />
      </div>
    </miniCalendarContext.Provider>
  );
};

Index.propTypes = {
  selectedDate: PropTypes.number,
};
export default Index;
