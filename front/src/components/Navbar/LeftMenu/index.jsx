import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import { useDispatch, useSelector } from 'react-redux';
import { addDate, selectDate, addMonth } from '../../../store/date';
import { selectedDateSelector } from '../../../store/selectors/date';
import Moment from '../../../utils/moment';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

const Index = ({ toggleSideBar }) => {
  //redux 오늘 날짜 가지고 오기
  let state = useSelector(selectedDateSelector);
  let dispatch = useDispatch();
  let url = useLocation(); //url 주소 가지고 오기
  let [nextText, setNextText] = useState(); //이전 버튼 툴팁
  let [previText, setPreviText] = useState(); //다음 버튼 툴팁
  const today = new Moment().toObject();

  //오늘 기준 월,일로 변경
  function toDate() {
    dispatch(selectDate(today));
  }

  // 다음 버튼 클릭시 일 변경
  function nextBtn() {
    url.pathname == '/day' ? dispatch(addDate(1)) : null;
    url.pathname == '/week' ? dispatch(addDate(7)) : null;
    url.pathname == '/month' ? dispatch(addMonth(1)) : null;
    url.pathname == '/year' ? dispatch(addMonth(12)) : null;
    url.pathname == '/agenda' ? dispatch(addDate(1)) : null;
    url.pathname == '/customday' ? dispatch(addDate(4)) : null;
  }

  //이전 버튼 클릭시 일 변경
  function previousBtn() {
    url.pathname == '/day' ? dispatch(addDate(-1)) : null;
    url.pathname == '/week' ? dispatch(addDate(-7)) : null;
    url.pathname == '/month' ? dispatch(addMonth(-1)) : null;
    url.pathname == '/year' ? dispatch(addMonth(-12)) : null;
    url.pathname == '/agenda' ? dispatch(addDate(-1)) : null;
    url.pathname == '/customday' ? dispatch(addDate(-4)) : null;
  }

  //이전,다음 버튼 툴팁 변경
  useEffect(() => {
    if (url.pathname == '/day') {
      setNextText('다음날');
      setPreviText('전날');
    } else if (url.pathname == '/week') {
      setNextText('다음 주');
      setPreviText('전 주');
    } else if (url.pathname == '/month') {
      setNextText('다음 달');
      setPreviText('전 달');
    } else if (url.pathname == '/year') {
      setNextText('다음 연도');
      setPreviText('이전 연도');
    } else if (url.pathname == '/agenda') {
      setNextText('다음날');
      setPreviText('전날');
    } else if (url.pathname == '/customday') {
      setNextText('다음 기간');
      setPreviText('이전 기간');
    }
  }, [url.pathname]);

  return (
    <div>
      <div className={styles.left_menu}>
        <div
          className={styles.hamburger}
          onClick={() => toggleSideBar(toggle => !toggle)}
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
                  previousBtn();
                }}
              >
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  className={styles.todate_icon}
                />
                <em>{previText}</em>
              </li>
              <li
                onClick={() => {
                  nextBtn();
                }}
              >
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className={styles.todate_icon}
                />
                <em>{nextText}</em>
              </li>
            </ul>
          </div>
          <div className={styles.todate_text}>
            <h2>
              {state.year}년{' '}
              {url.pathname == '/year' ? null : `${state.month}월`}{' '}
              {url.pathname == '/day' || url.pathname == '/agenda'
                ? `${state.date}일`
                : null}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

Index.propTypes = {
  toggleSideBar: PropTypes.func,
};

export default Index;
