import React from 'react';
import styles from './style.module.css';

import PropTypes from 'prop-types';
import CalendarSummary from './CalendarSummary';
import CalendarItem from './CalendarItem';

import ModalLayout from '../../../modal/layout/ModalLayout';
import CalendarOptionModal from '../../../modal/component/CalendarOptionModal';

const Index = ({ title, calendars }) => {
  return (
    <ModalLayout Modal={CalendarOptionModal}>
      <details className={styles.calendar_details} open>
        <CalendarSummary title={title} />

        {calendars.map(calendar => (
          <CalendarItem key={calendar.id} calendar={calendar} />
        ))}
      </details>
    </ModalLayout>
  );
};

Index.propTypes = {
  title: PropTypes.string,
  calendars: PropTypes.array,
};

export default Index;
