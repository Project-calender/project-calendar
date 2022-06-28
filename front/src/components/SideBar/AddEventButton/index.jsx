import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const index = () => {
  return (
    <button className={styles.event_btn}>
      <FontAwesomeIcon icon={faPlus} />
      <span className={styles.event_btn_text}>만들기</span>
      <FontAwesomeIcon icon={faCaretDown} />
    </button>
  );
};

export default index;
