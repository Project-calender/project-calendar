import PropTypes from 'prop-types';
import React from 'react';
import styles from './style.module.css';

const Index = ({ barInfo }) => {
  return (
    <div className={styles.event_bar} data-scale={barInfo.scale}>
      <p>(제목 없음)</p>
    </div>
  );
};

Index.propTypes = {
  barInfo: PropTypes.object,
};

export default Index;
