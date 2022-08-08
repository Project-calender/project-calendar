import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ title, children, top = 10 }) => {
  return (
    <div className={styles.tooltip}>
      {children}
      <em style={{ top: `calc(100% + ${top}px)` }}>{title}</em>
    </div>
  );
};

Index.propTypes = {
  title: PropTypes.string,
  top: PropTypes.number,
  children: PropTypes.node,
};

export default Index;
