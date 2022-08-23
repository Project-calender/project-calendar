import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Index = ({ setAddMemo }) => {
  return (
    <div className={styles.memo}>
      <FontAwesomeIcon icon={faBarsStaggered} />

      <div
        className={styles.invite_title}
        onClick={e => {
          setAddMemo(true);
          e.stopPropagation();
        }}
      >
        <h4>설명 또는 첨부파일 추가</h4>
      </div>
    </div>
  );
};

Index.propTypes = {
  setAddMemo: PropTypes.func,
};

export default Index;
