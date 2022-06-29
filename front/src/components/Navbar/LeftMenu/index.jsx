import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import { useState } from 'react';

const Index = () => {
  const data = new Date();
  const today = {
    year: data.getFullYear(), //오늘 연도
    month: data.getMonth() + 1, //오늘 월
    date: data.getDate(), //오늘 날짜
    day: data.getDay(), //오늘 요일
  };
  const [selectedYear] = useState(today.year); //현재 선택된 연도
  const [selectedMonth, setSelectedMonth] = useState(today.month); //현재 선택된 달
  const [selectedDate, setSelectedDate] = useState(today.date); //현재 선택된 달
  const dateTotalCount = new Date(selectedYear, selectedMonth, 0).getDate(); //선택된 연도, 달의 마지막 날짜

  //이전 일로 변경
  function prevDate() {
    if (selectedDate == 1) {
      setSelectedDate(new Date(selectedYear, selectedMonth - 1, 0).getDate());
      setSelectedMonth(selectedMonth - 1);
    } else {
      setSelectedDate(selectedDate - 1);
    }
  }

  //다음 일로 변경
  function nextDate() {
    if (selectedDate == dateTotalCount) {
      setSelectedDate(1);
      setSelectedMonth(selectedMonth + 1);
    } else {
      setSelectedDate(selectedDate + 1);
    }
  }

  //이번 월,일로 변경
  function toDate() {
    setSelectedMonth(today.month);
    setSelectedDate(today.date);
  }

  return (
    <div>
      <div className={styles.left_menu}>
        <div className={styles.hamburger}>
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
                  prevDate();
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
                  nextDate();
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
              {selectedYear}년 {selectedMonth}월 {selectedDate}일
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
