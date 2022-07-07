import React from 'react';
import styles from './style.module.css';

import { WEEK_DAYS } from '../../../../../utils/moment';
import Tooltip from '../../../../common/Tooltip';

const Index = () => {
  return (
    <tr className={styles.weekdays_tr}>
      {WEEK_DAYS.map(item => {
        return (
          <th key={item}>
            <Tooltip title={`${item}요일`}>{item}</Tooltip>
          </th>
        );
      })}
    </tr>
  );
};

export default Index;
