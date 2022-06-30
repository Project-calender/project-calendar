import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ title, children }) => {
  return (
    <div className={styles.tooltip}>
      {children}
      <em>{title}</em>
    </div>
  );
};

Index.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Index;
