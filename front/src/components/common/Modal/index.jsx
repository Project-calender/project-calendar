import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ children }) => {
  return (
    <div className={styles.modal_container}>
      <div className={styles.modal_contexts}>{children}</div>
    </div>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};
export default Index;
