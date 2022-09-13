import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

import Moment from '../../../../utils/moment';

const Index = ({ date = new Moment(), events = [] }) => {
  const isToday = date.time === new Moment().time;

  return (
    <div className={`${styles.title} ${isToday ? styles.today : ''}`}>
      <em>{date.weekDay}</em>
      <p>{date.date}</p>
      <div>
        {events.map(event => (
          <div key={event.id}>{event.name}</div>
        ))}
      </div>
    </div>
  );
};

Index.propTypes = {
  date: PropTypes.object,
  events: PropTypes.array,
};

export default Index;
