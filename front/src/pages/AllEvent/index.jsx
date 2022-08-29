import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { EVENT } from '../../store/events';
import axios from '../../utils/token';
import styles from './style.module.css';

const Index = () => {
  let [toDay, setToDay] = useState(); //오늘 날짜
  let [allEvent, setAllEvent] = useState(); //모든 이벤트
  let [filterEvent, setFilterEvent] = useState(); //필터된 이벤트
  let [day, setDay] = useState(); //한국 일자

  useEffect(() => {
    axios
      .post(`event/searchEvent`, {
        searchWord: ``,
      })
      .then(res => {
        setAllEvent(res.data);
      });
  }, []);

  useEffect(() => {
    eventFilter();
    let date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const dateStr = year + month + day;

    setToDay(dateStr);
  }, [allEvent]);

  function eventFilter() {
    let copyAllEvent = allEvent && [...allEvent];
    //날짜 순으로 정렬
    let newAllEvent =
      allEvent &&
      copyAllEvent.sort(function (a, b) {
        return (
          a.startTime.substr(0, 10).replaceAll('-', '') -
          b.startTime.substr(0, 10).replaceAll('-', '')
        );
      });

    // 현재 날짜 기준으로 필터
    newAllEvent =
      newAllEvent &&
      newAllEvent.filter(a => {
        let date = new Date(a.startTime);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const dateStr = year + month + day;

        return dateStr >= toDay && dateStr <= 20230829;
      });

    let newToDay =
      newAllEvent &&
      newAllEvent.map(a => {
        let date = new Date(a.startTime);
        const day = ('0' + date.getDate()).slice(-2);
        return day;
      });

    setDay(newToDay);

    setFilterEvent(newAllEvent);
  }

  return (
    <>
      <div className={styles.container}>
        <ul>
          {filterEvent &&
            filterEvent.map(function (item, index) {
              return (
                <li key={index}>
                  <div className={styles.time}>
                    <div className={styles.day}>
                      <em>{day[index]}</em>
                    </div>
                    <div className={styles.year}>
                      <p>
                        {item.startTime.substr(0, 4)}년
                        {item.startTime.substr(5, 2)}월
                      </p>
                    </div>
                  </div>
                  <div className={styles.event_wrap}>
                    <div className={styles.all_day}>
                      {item.allDay == EVENT.allDay.true ||
                      item.endTime.substr(5, 5).replace('-', '') -
                        item.startTime.substr(5, 5).replace('-', '') >
                        1 ? (
                        <em>종일</em>
                      ) : (
                        <em>
                          {item.startTime.substr(11, 5)} ~{' '}
                          {item.endTime.substr(11, 5)}
                        </em>
                      )}
                    </div>
                    <div className={styles.content}>
                      <p>{item.name}</p>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
        {filterEvent && filterEvent.length == 0 ? (
          <div className={styles.search_undefined}>
            <em>이벤트 결과가 없습니다.</em>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Index;
