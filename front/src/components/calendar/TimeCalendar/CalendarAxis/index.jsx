import React from 'react';
import { useEffect, useState } from 'react';
import styles from './style.module.css';
import Moment from '../../../../utils/moment';

const Index = () => {
  const [timeLabels, setTimeLabels] = useState([]);

  useEffect(() => {
    const moment = new Moment();
    const times = [''];
    for (let hour = 1; hour < 24; hour++) {
      times.push(moment.setHour(hour));
    }
    setTimeLabels(times);
  }, []);

  return (
    <div>
      {timeLabels.map((time, index) => (
        <div key={index} className={styles.calendar_axis}>
          <div className={styles.calendar_axis_text}>
            {time && (
              <em>
                {time.getTimeType()} {time.hour % 12 || 12}시
              </em>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Index;
