import PropTypes from 'prop-types';
import React from 'react';
import styles from './style.module.css';

const Index = ({ eventBar }) => {
  if (!eventBar) return;
  console.log(eventBar);
  return (
    <div className={styles.event_bar} data-scale={eventBar?.scale || 1}>
      <p>(제목 없음)</p>
    </div>
  );
};

Index.propTypes = {
  eventBar: PropTypes.object,
};

export default Index;
