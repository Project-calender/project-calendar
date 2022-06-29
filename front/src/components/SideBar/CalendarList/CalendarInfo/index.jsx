import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Tooltip from '../../../common/Tooltip';

const Index = ({ calendar }) => {
  return (
    <label className={styles.calendarInfo_label}>
      <input type="checkbox" />
      <Tooltip key={calendar.id} title={calendar.calendarName}>
        <p>{calendar.calendarName}</p>
      </Tooltip>
    </label>
  );
};

Index.propTypes = {
  calendar: PropTypes.object,
};

export default Index;
