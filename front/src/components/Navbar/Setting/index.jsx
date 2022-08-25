import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Tooltip from './../../common/Tooltip';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import { CALENDAR_PATH } from '../../../constants/path';

const Index = ({ setMenuActive }) => {
  let navigate = useNavigate();
  return (
    <div className={styles.search_wrap}>
      <div className={styles.title}>
        <Tooltip title="뒤로가기">
          <div
            className={styles.back_icon}
            onClick={() => {
              setMenuActive(1);
              navigate(CALENDAR_PATH.MAIN);
            }}
          >
            {' '}
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Tooltip>
        <h2>설정</h2>
      </div>
    </div>
  );
};

Index.propTypes = {
  setMenuActive: PropTypes.func,
};

export default Index;
