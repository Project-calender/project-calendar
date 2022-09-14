import React from 'react';
import { useEffect, useState } from 'react';
import styles from './style.module.css';
import Moment from '../../../../utils/moment';

const Index = () => {
  const [timeLabels, setTimeLabels] = useState([]);

  useEffect(() => {
    const moment = new Moment();
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      times.push(moment.setHour(hour));
    }
    setTimeLabels(times);
  }, []);

  return (
    <>
      {timeLabels.map((time, index) => (
        <tr key={index} style={styles}>
          <th>
            <em>
              {time.getTimeType()} {time.hour % 12 || 12}시
            </em>
          </th>
        </tr>
      ))}
    </>
  );
};

export default Index;
