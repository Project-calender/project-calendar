import React from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import Moment from '../../../../utils/moment';

const Index = ({ dates }) => {
  console.log(dates);

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
    <tbody>
      {timeLabels.map((time, index) => {
        return (
          <tr key={index}>
            <th>
              <em>
                {time.getTimeType()} {time.hour % 12 || 12}시
              </em>
            </th>
            {dates.map(date => {
              <td key={date}>
                <div className={styles.td_text}>칸</div>
              </td>;
            })}
          </tr>
        );
      })}
    </tbody>
  );
};
Index.propTypes = {
  dates: PropTypes.array,
};

export default Index;
