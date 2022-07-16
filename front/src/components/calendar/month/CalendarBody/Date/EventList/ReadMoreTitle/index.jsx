import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ events }) => {
  if (!events.length) return;

  return (
    <div className={styles.title}>
      <em>{events.length}개 더보기</em>
    </div>
  );
};
Index.propTypes = {
  events: PropTypes.array,
};

export default Index;
