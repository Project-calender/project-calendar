import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import {
  faSearch,
  faCog,
  faQuestionCircle,
  faCaretDown,
  faList,
  faCheck,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import Tooltip from './../../common/Tooltip';

const Index = ({
  activeClass,
  setActiveClass,
  dateActive,
  setDateActive,
  userClassAdd,
  setUserClassAdd,
  userActive,
  setUserActive,
}) => {
  let navigate = useNavigate();
  let [changeDate, setChangeDate] = useState(`일`);

  //일,주,연 버튼 팝업창 컨트롤
  function dateChange() {
    if (dateActive == false) {
      setDateActive(true);
      setActiveClass(`${styles.active}`);
    } else {
      setDateActive(false);
      setActiveClass(``);
    }
  }

  //사용자 정보 팝업창 컨트롤
  function userPopUp() {
    if (userActive == false) {
      setUserActive(true);
      setUserClassAdd(`${styles.active}`);
    } else {
      setUserActive(false);
      setUserClassAdd(``);
    }
  }
  return (
    <div>
      <div className={styles.right_menu}>
        <div className={styles.menu_icon}>
          <ul>
            <li>
              <FontAwesomeIcon icon={faSearch} className={styles.icon} />
              <em>검색</em>
            </li>
            <li>
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className={styles.icon}
              />
              <em>지원</em>
            </li>
            <li>
              <FontAwesomeIcon icon={faCog} className={styles.icon} />
              <em>설정메뉴</em>
            </li>
          </ul>
        </div>
        <div className={`${styles.date_list} ${activeClass}`}>
          <div
            className={styles.date_btt}
            onClick={e => {
              e.stopPropagation();
              dateChange();
              setUserActive(false);
              setUserClassAdd(``);
            }}
          >
            <strong>{changeDate}</strong>
            <FontAwesomeIcon icon={faCaretDown} className={styles.icon} />
          </div>
          <div className={styles.option_list}>
            <ul>
              <li
                onClick={e => {
                  navigate('/today');
                  setChangeDate(e.target.children[0].textContent);
                  setDateActive(false);
                  setActiveClass(``);
                }}
              >
                <strong>일</strong>
                <em>D</em>
              </li>
              <li
                onClick={e => {
                  navigate('/week');
                  setChangeDate(e.target.children[0].textContent);
                  setDateActive(false);
                  setActiveClass(``);
                }}
              >
                <strong>주</strong>
                <em>W</em>
              </li>
              <li
                onClick={e => {
                  navigate('/month');
                  setChangeDate(e.target.children[0].textContent);
                  setDateActive(false);
                  setActiveClass(``);
                }}
              >
                <strong>월</strong>
                <em>M</em>
              </li>
              <li
                onClick={e => {
                  navigate('/year');
                  setChangeDate(e.target.children[0].textContent);
                  setDateActive(false);
                  setActiveClass(``);
                }}
              >
                <strong>연도</strong>
                <em>Y</em>
              </li>
              <li
                onClick={e => {
                  navigate('/plan');
                  setChangeDate(e.target.children[0].textContent);
                  setDateActive(false);
                  setActiveClass(``);
                }}
              >
                <strong>일정</strong>
                <em>A</em>
              </li>
              <li
                onClick={e => {
                  navigate('/customday');
                  setChangeDate(e.target.children[0].textContent);
                  setDateActive(false);
                  setActiveClass(``);
                }}
              >
                <strong>4일</strong>
                <em>X</em>
              </li>
            </ul>
            <span className={styles.line}></span>
            <div className={styles.option_check}>
              <ul>
                <li>
                  <FontAwesomeIcon icon={faCheck} className={styles.icon} />
                  <em>주말 표시</em>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} className={styles.icon} />
                  <em>거절한 일정 표시</em>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.more}>
          <Tooltip title="Google 앱">
            <FontAwesomeIcon icon={faList} className={styles.icon} />
          </Tooltip>
        </div>
        <div
          className={`${styles.user} ${userClassAdd}`}
          onClick={e => {
            e.stopPropagation();
            userPopUp();
            setDateActive(false);
            setActiveClass(``);
          }}
        >
          <Tooltip title="Google 계정">
            <img src={`${process.env.PUBLIC_URL}/img/user_img.png`} alt="" />
          </Tooltip>
          <div className={styles.user_inpo}>
            <div className={styles.user_profile}>
              <div className={styles.user_img}>
                <img
                  src={`${process.env.PUBLIC_URL}/img/user_img.png`}
                  alt=""
                />
              </div>
              <h2>userName</h2>
              <em>user@gmail.com</em>
              <button>
                <strong>Google</strong> 계정 관리
              </button>
            </div>
            <div className={styles.account}>
              <ul>
                <li>
                  <div className={styles.account_img}>
                    <img
                      src={`${process.env.PUBLIC_URL}/img/user_img.png`}
                      alt=""
                    />
                  </div>
                  <div className={styles.account_text}>
                    <p>userName</p>
                    <p>userEmail@gmail.com</p>
                  </div>
                </li>
              </ul>
              <div className={styles.user_add}>
                <FontAwesomeIcon icon={faUserPlus} className={styles.icon} />
                <p>다른계정 추가</p>
              </div>
            </div>
            <div className={styles.all_logout}>
              <button>모든 계정에서 로그아웃</button>
            </div>
            <div className={styles.service}>
              <ul>
                <li>
                  <em>개인정보처리방침</em>
                </li>
                <li>
                  <em>•</em>
                </li>
                <li>
                  <em>서비스 약관</em>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
Index.propTypes = {
  activeClass: PropTypes.string,
  setActiveClass: PropTypes.func,
  dateActive: PropTypes.bool,
  setDateActive: PropTypes.func,
  userClassAdd: PropTypes.string,
  setUserClassAdd: PropTypes.func,
  userActive: PropTypes.bool,
  setUserActive: PropTypes.func,
};

export default Index;
