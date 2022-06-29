import React from 'react';
import styles from './style.module.css';

const Index = () => {
  return (
    <>
      <input
        className={styles.search_input}
        type="text"
        placeholder="사용자 검색"
      />
      <span className={styles.focus_border}></span>
    </>
  );
};

export default Index;
