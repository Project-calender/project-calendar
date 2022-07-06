import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

const Index = ({ state }) => {
  return (
    <div className={styles.today}>
      <em>{state.weekDay}</em>
      <p>{state.date}</p>
    </div>
  );
};
Index.propTypes = {
  state: PropTypes.object,
};

export default Index;
