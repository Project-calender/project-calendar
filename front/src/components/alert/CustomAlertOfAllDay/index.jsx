import React from 'react';
import styles from './style.module.css';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Input from '../../common/Input';

const Index = () => {
  return (
    <div className={styles.alert_options}>
      <div className={styles.list_container}>
        <h3>알림</h3>
        <FontAwesomeIcon icon={faCaretDown} />
      </div>
      <Input type="number" defaultValue={1} className={styles.alert_input} />
      <div className={styles.list_container}>
        <h3>일</h3>
        <FontAwesomeIcon icon={faCaretDown} />
      </div>
      <h3>전</h3>
      <Input defaultValue="오전 9:00" className={styles.alert_input} />
    </div>
  );
};

export default Index;
