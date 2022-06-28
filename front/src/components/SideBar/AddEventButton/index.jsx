import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const index = () => {
  return (
    <button className={styles.event_btn}>
      <FontAwesomeIcon icon={faPlus} className={styles.event_icon_plus} />
      <span>만들기</span>
      <FontAwesomeIcon icon={faCaretDown} className={styles.event_icon_caret} />
    </button>
  );
};

export default index;
