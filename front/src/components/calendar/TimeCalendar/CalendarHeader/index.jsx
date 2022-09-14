import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

import Moment from '../../../../utils/moment';

const Index = ({ dates = [], events = [] }) => {
  const isToday = date => date.time === new Moment().time;

  return (
    <thead className={styles.title}>
      {dates.map(date => (
        <tr key={date.time}>
          <th className={`${isToday(date) ? styles.today : ''}`}>
            <em>{date.weekDay}</em>
            <p>{date.date}</p>
            <div className={styles.title_events}>
              {events.map(event => (
                <div key={event.id}>{event.name}</div>
              ))}
            </div>
          </th>
        </tr>
      ))}
    </thead>
  );
};

Index.propTypes = {
  dates: PropTypes.array,
  events: PropTypes.array,
};

export default Index;
