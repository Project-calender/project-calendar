import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ events, clickReadMore }) => {
  return (
    <div className={styles.title}>
      <em onClick={clickReadMore}>{events.length}개 더보기</em>
    </div>
  );
};
Index.propTypes = {
  events: PropTypes.array,
  clickReadMore: PropTypes.func,
};

export default Index;
