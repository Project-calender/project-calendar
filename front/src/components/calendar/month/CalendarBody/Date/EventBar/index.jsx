import PropTypes from 'prop-types';
import React from 'react';
import styles from './style.module.css';

const Index = ({ eventBar }) => {
  if (!eventBar) return;

  return (
    <div className={styles.event_bar} data-scale={eventBar.scale}>
      <p>(제목 없음)</p>
    </div>
  );
};

Index.propTypes = {
  eventBar: PropTypes.object,
};

export default Index;
