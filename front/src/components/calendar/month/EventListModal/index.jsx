import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
const Index = ({ events }) => {
  console.log(events);
  return <div className={styles}>모달</div>;
};

Index.propTypes = {
  events: PropTypes.array,
};

export default Index;
