import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import { useDispatch, useSelector } from 'react-redux';
import { addDate, initDate } from '../../../store/date';
import { stateSelectedDate } from '../../../store/selectors/date';

const Index = ({ setSideBar, sideBar }) => {
  //redux 오늘 날짜 가지고 오기
  let state = useSelector(stateSelectedDate);
  let dispatch = useDispatch();

  const data = new Date();
  const today = {
    year: data.getFullYear(), //오늘 연도
    month: data.getMonth() + 1, //오늘 월
    date: data.getDate(), //오늘 날짜
    day: data.getDay(), //오늘 요일
  };

  //오늘 기준 월,일로 변경
  function toDate() {
    dispatch(initDate());
  }

  function sideBarClose() {
    if (sideBar == false) {
      setSideBar(true);
    } else {
      setSideBar(false);
    }
  }

  return (
    <div>
      <div className={styles.left_menu}>
        <div
          className={styles.hamburger}
          onClick={() => {
            sideBarClose();
          }}
        >
          <div className={styles.hamburger_icon}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <em>기본 메뉴</em>
        </div>
        <div className={styles.title}>
          <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="" />
          <h1>캘린더</h1>
        </div>
        <div
          className={styles.today_btt}
          onClick={() => {
            toDate();
          }}
        >
          <em>오늘</em>
          <p>
            {today.month}월 {today.date}일
          </p>
        </div>
        <div className={styles.todate}>
          <div className={styles.todate_icon_wrap}>
            <ul>
              <li
                onClick={() => {
                  dispatch(addDate(-1));
                }}
              >
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  className={styles.todate_icon}
                />
                <em>전날</em>
              </li>
              <li
                onClick={() => {
                  dispatch(addDate(1));
                }}
              >
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className={styles.todate_icon}
                />
                <em>다음날</em>
              </li>
            </ul>
          </div>
          <div className={styles.todate_text}>
            <h2>
              {state.year}년 {state.month}월 {state.date}일
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

Index.propTypes = {
  sideBar: PropTypes.bool,
  setSideBar: PropTypes.func,
};

export default Index;
