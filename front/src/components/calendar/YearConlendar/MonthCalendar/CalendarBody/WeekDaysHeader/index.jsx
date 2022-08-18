import React from 'react';
import styles from './style.module.css';

import Tooltip from '../../../../../common/Tooltip';
import { WEEK_DAYS } from '../../../../../../utils/moment';

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
