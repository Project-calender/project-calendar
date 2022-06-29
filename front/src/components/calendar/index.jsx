import React, { useEffect } from 'react';
import { useState } from 'react';
import styles from './calendar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'; //폰트어썸

const Index = () => {
  const data = new Date();
  const today = {
    year: data.getFullYear(), //오늘 연도
    month: data.getMonth() + 1, //오늘 월
    date: data.getDate(), //오늘 날짜
    day: data.getDay(), //오늘 요일
  };
  const week = ['일', '월', '화', '수', '목', '금', '토']; //일주일
  const [selectedYear, setSelectedYear] = useState(today.year); //현재 선택된 연도
  const [selectedMonth, setSelectedMonth] = useState(today.month); //현재 선택된 달
  const dateTotalCount = new Date(selectedYear, selectedMonth, 0).getDate(); //선택된 연도, 달의 마지막 날짜
  const selectedDay = new Date(`${selectedYear}-${selectedMonth}`).getDay(); //현재 선택된 달의 시작 요일
  let [dateNum, setDateNum] = useState([]); //현재 선택된 달의 날짜 갯수
  //let [weekNum,setWeekNum] = useState([]); //현재 선택된 달의 주 갯수
  let newDate = []; //date 랜더
  let [, /*dateText*/ setDateText] = useState(); //클릭한 날짜 저장

  //이전 달로 변경
  function prevMonth() {
    if (selectedMonth == 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  }

  //다음 달로 변경
  function nextMonth() {
    if (selectedMonth == 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  }

  //해당 월의 날짜 랜더 함수
  function dateSlice() {
    let copyDate = [...dateNum];
    newDate.push(copyDate.slice(0, 7));
    newDate.push(copyDate.slice(7, 14));
    newDate.push(copyDate.slice(14, 21));
    newDate.push(copyDate.slice(21, 28));
    newDate.push(copyDate.slice(28, 35));
    newDate.push(copyDate.slice(35, 41));
  }

  useEffect(() => {
    let dateCount = [];
    let weekCount = [];

    //이전 달의 마지막 날짜 확인
    for (let i = selectedDay; i > 0; i--) {
      //let prevMonshDate = new Date(selectedYear, selectedMonth - 1, 0).getDate() - i;
      dateCount.push(''); //prevMonshDate + 1
    }

    //현재 달의 마지막요일 만큼 날짜 생성
    for (let i = 1; i <= dateTotalCount; i++) {
      dateCount.push(i);
    }

    //다음 달의 첫번째 날짜 확인
    let remain_day = 7 - (dateCount.length % 7);
    for (let i = 0; i < remain_day; i++) {
      //let nextMonshDate = new Date(selectedYear, selectedMonth + 1, 1).getDate() + i;
      dateCount.push(''); //nextMonshDate
    }

    //해당 월이 몇주인지 확인
    for (let i = 0; i < dateCount.length / 7; i++) {
      weekCount.push(i);
    }
    setDateNum(dateCount);
    //setWeekNum(weekCount);

    //renderCalendar(dateCount);
  }, [selectedMonth]);

  dateSlice();

  return (
    <div>
      <div className={styles.calendar_wrap}>
        <div className={styles.year}>
          <div className={styles.text}>
            <em>{selectedYear}년</em>
            <em>{selectedMonth}월</em>
          </div>
          <div className={styles.year_btt}>
            <button
              onClick={() => {
                prevMonth();
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button
              onClick={() => {
                nextMonth();
              }}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
        </div>
        <table className={styles.calendar_talbe}>
          <thead>
            <tr>
              {week.map((item, index) => {
                return <th key={index}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {newDate &&
              newDate.map((item, index) => {
                return (
                  <tr key={index}>
                    {item.map((item2, index2) => {
                      return (
                        <td
                          key={index2}
                          className={
                            item2 == today.date && today.month == selectedMonth
                              ? `${styles.active}`
                              : null
                          }
                          onClick={e => {
                            setDateText([
                              selectedYear,
                              selectedMonth,
                              Number(e.target.textContent),
                            ]);
                          }}
                        >
                          <em>{item[index2]}</em>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
