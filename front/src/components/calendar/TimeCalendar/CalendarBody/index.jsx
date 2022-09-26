import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

const Index = ({ dates }) => {
  const times = [...Array(24)].map((_, i) => i);
  return (
    <div className={styles.calendar_body}>
      <div>
        {times.map(i => (
          <div key={i} className={styles.calendar_axis_line} />
        ))}
      </div>
      {dates.map(date => (
        <div key={date.time}>
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
};

export default Index;
