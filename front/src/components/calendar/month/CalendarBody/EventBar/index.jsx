import PropTypes from 'prop-types';
import React from 'react';
import styles from './style.module.css';

const Index = ({ scale }) => {
  return (
    <div className={`${styles.event_bar} ${styles['scale' + scale]}`}>
      <p>(제목 없음)</p>
    </div>
  );
};

Index.propTypes = {
  scale: PropTypes.number,
};

export default Index;
