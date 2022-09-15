import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ dates, events }) => {
  console.log(events);
  return (
    <tr className={styles.events_tr}>
      <td>
        <em>GMT+09</em>
      </td>
      <td />
      {dates.map(date => (
        <td key={date.time}>
          <div></div>
        </td>
      ))}
    </tr>
  );
};

Index.propTypes = {
  dates: PropTypes.array,
  events: PropTypes.array,
};

export default Index;
