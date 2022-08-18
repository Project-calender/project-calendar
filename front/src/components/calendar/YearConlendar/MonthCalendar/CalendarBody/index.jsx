import React from 'react';
import styles from './style.module.css';

import WeekDaysHeader from './WeekDaysHeader';
import Week from './Week';
import PropTypes from 'prop-types';
import { calculateMonth } from '../../../../../utils/moment';
import { useMemo } from 'react';

const Index = ({ year, month }) => {
  const weeks = useMemo(() => calculateMonth(year, month), [year, month]);

  return (
    <table className={styles.calendar_table}>
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
