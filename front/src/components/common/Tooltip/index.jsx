import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ title, children, top = 10, left = 0, className = '' }) => {
  return (
    <div className={`${styles.tooltip} ${className}`}>
      {children}
      <em
        style={{ top: `calc(100% + ${top}px)`, left: `calc(50% + ${left}px)` }}
      >
        {title}
      </em>
    </div>
  );
};

Index.propTypes = {
  title: PropTypes.string,
  top: PropTypes.number,
  left: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Index;
