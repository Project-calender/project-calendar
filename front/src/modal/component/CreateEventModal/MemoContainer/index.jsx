import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import {
  faBarsStaggered,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useDispatch } from 'react-redux';
import { updateNewEventBarProperties } from '../../../../store/newEvent';
import Input from '../../../../components/common/Input';

const Index = ({ autoFocus }) => {
  const dispatch = useDispatch();
  function handleEventMemo(e) {
    dispatch(updateNewEventBarProperties({ memo: e.target.value }));
  }

  return (
    <>
      <div className={styles.memo}>
        <FontAwesomeIcon icon={faBarsStaggered} />
        <Input
          type="text"
          placeholder="설명 추가"
          onBlur={handleEventMemo}
          autoFocus={autoFocus}
        />
      </div>
      <div>
        <FontAwesomeIcon icon={faPaperclip} className={styles.clip_icon} />
        <h4 className={styles.file_title}>첨부파일 추가</h4>
      </div>
    </>
  );
};

Index.propTypes = {
  autoFocus: PropTypes.bool,
};

export default Index;
