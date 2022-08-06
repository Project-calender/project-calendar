import React from 'react';
import styles from './style.module.css';

import PropTypes from 'prop-types';
import CalendarSummary from './CalendarSummary';
import CalendarItem from './CalendarItem';

import ModalLayout from '../../../modal/layout/ModalLayout';
import {
  DeleteCalendarContext,
  CalendarOptionContext,
} from '../../../context/EventModalContext';
import CalendarOptionModal from '../../../modal/component/CalendarOptionModal';
import DeleteCalendarModal from '../../../modal/component/DeleteCalendarModal';

const Index = ({ title, calendars }) => {
  return (
    <ModalLayout Modal={DeleteCalendarModal} Context={DeleteCalendarContext}>
      <ModalLayout Modal={CalendarOptionModal} Context={CalendarOptionContext}>
        <details className={styles.calendar_details} open>
          <CalendarSummary title={title} />

          {calendars.map(calendar => (
            <CalendarItem key={calendar.id} calendar={calendar} />
          ))}
        </details>
      </ModalLayout>
    </ModalLayout>
  );
};

Index.propTypes = {
  title: PropTypes.string,
  calendars: PropTypes.array,
};

export default Index;
