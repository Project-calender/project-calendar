import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ eventBar }) => {
  return <div className={styles.eventBar}>{eventBar.event.name}</div>;
};

Index.propTypes = {
  eventBar: PropTypes.object,
};

export default Index;
