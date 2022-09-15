import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

import Moment from '../../../../utils/moment';

const Index = ({ dates = [] }) => {
  const isToday = date => date.time === new Moment().time;

  return (
    <thead className={styles.title_container}>
      <tr />
      {dates.map(date => (
        <>
          <tr key={date.time}>
            <th className={`${isToday(date) ? styles.today : ''}`}>
              <em>{date.weekDay}</em>
              <p>{date.date}</p>
            </th>
          </tr>
        </>
      ))}
    </thead>
  );
};

Index.propTypes = {
  dates: PropTypes.array,
};

export default Index;
