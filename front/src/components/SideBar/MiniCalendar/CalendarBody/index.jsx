import React from 'react';
import styles from './style.module.css';

import WeekDaysHeader from './WeekDaysHeader';
import Week from './Week';
import PropTypes from 'prop-types';
import { calculateMonth } from '../../../../utils/moment';

const Index = ({ year, month }) => {
  const weeks = calculateMonth(year, month);

  return (
    <table className={styles.calendar_talbe}>
      <thead>
        <WeekDaysHeader />
      </thead>
      <tbody>
        {weeks.map((week, index) => (
          <Week key={index} week={week} month={month} />
        ))}
      </tbody>
    </table>
  );
};

Index.propTypes = {
  year: PropTypes.number,
  month: PropTypes.number,
};

export default Index;
