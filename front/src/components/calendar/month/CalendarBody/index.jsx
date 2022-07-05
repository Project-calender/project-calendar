import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Date from './Date';

const Index = ({ month }) => {
  return (
    <>
      {month.map((week, index) => (
        <tr key={index} className={styles}>
          {week.map((date, index) => (
            <Date key={index} date={date} />
          ))}
        </tr>
      ))}
    </>
  );
};

Index.propTypes = {
  month: PropTypes.array,
};

export default Index;
