import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import { createTimeEventBar } from '../../../../hooks/useCreateTimeEventBar';

const Index = ({ dates, events }) => {
  const times = [...Array(24)].map((_, i) => i);
  const eventBars = createTimeEventBar(events);
  console.log('bar', eventBars);

  return (
    <div className={styles.calendar_body}>
      <div>
        {times.map(i => (
          <div key={i} className={styles.calendar_axis_line} />
        ))}
      </div>
      {dates.map(date => (
        <div key={date.time} className={styles.calendar_event_container}>
          <div className={styles.calendar_event_list} />
          {times.map(i => (
            <div key={i} />
          ))}
        </div>
      ))}
    </div>
  );
};
Index.propTypes = {
  dates: PropTypes.array,
  events: PropTypes.array,
};

export default Index;
