import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Index = () => {
  const [isKeyUp, setKeyUp] = useState(false);
  return (
    <div className={styles.search}>
      {!isKeyUp && (
        <FontAwesomeIcon
          icon={faUserGroup}
          className={styles.search_icon_group}
        />
      )}
      <input
        type="text"
        placeholder="사용자 검색"
        onKeyUp={e => setKeyUp(e.target.value)}
      />
      <span className={styles.focus_border}></span>
    </div>
  );
};

export default Index;
