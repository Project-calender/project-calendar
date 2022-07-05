import React from 'react';
import { WEEK_DAYS } from '../../../../utils/moment';
import styles from './style.module.css';

const Index = () => {
  return (
    <tr className={styles.calendar_tr}>
      {WEEK_DAYS.map(item => {
        return <th key={item}>{item}</th>;
      })}
    </tr>
  );
};

export default Index;
