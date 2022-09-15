import React from 'react';
import { useEffect, useState } from 'react';
import styles from './style.module.css';
import Moment from '../../../../utils/moment';

const Index = () => {
  const [timeLabels, setTimeLabels] = useState([]);

  useEffect(() => {
    const moment = new Moment();
    const times = [];
    for (let hour = 1; hour < 24; hour++) {
      times.push(moment.setHour(hour));
    }
    setTimeLabels(times);
  }, []);

  return (
    <>
      <td className={styles.calendar_axis}>
        {timeLabels.map((time, index) => (
          <div key={index}>
            <em>
              {time.getTimeType()} {time.hour % 12 || 12}시
            </em>
          </div>
        ))}
      </td>
      <td className={styles.calendar_axis_line}>
        {[...Array(24)].map((_, index) => (
          <div key={index} />
        ))}
      </td>
    </>
  );
};

export default Index;
