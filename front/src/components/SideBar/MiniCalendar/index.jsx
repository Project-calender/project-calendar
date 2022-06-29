import React, { useEffect } from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import { getMonth, WEEK_DAYS } from '../../../utils/moment';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [month, setMonth] = useState(getMonth(new Date()));

  useEffect(() => {
    setMonth(getMonth(selectedDate));
  }, [selectedDate]);

  function moveMonth(number) {
    setSelectedDate(preDate => {
      const date = new Date(preDate.getTime());
      date.setMonth(date.getMonth() + number);
      return date;
    });
  }

  function initDateClassName(date) {
    let className = '';
    if (date.isToday()) className += styles.today;
    else if (date.month !== selectedDate.getMonth() + 1)
      className += styles.blur;
    else if (date.time === selectedDate.getTime()) className += styles.active;

    return className;
  }

  return (
    <div className={styles.calendar_wrap}>
      <div className={styles.year}>
        <div className={styles.text}>
          <em>{selectedDate.getFullYear()}년</em>
          <em>{selectedDate.getMonth() + 1}월</em>
        </div>
        <div className={styles.year_btt}>
          <button onClick={() => moveMonth(-1)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button onClick={() => moveMonth(1)}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>
      <table className={styles.calendar_talbe}>
        <thead>
          <tr>
            {WEEK_DAYS.map(item => {
              return <th key={item}>{item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {month.map((week, index) => {
            return (
              <tr key={index}>
                {week.map((date, index) => {
                  return (
                    <td
                      key={index}
                      className={`${initDateClassName(date)}`}
                      onClick={() => {
                        setSelectedDate(new Date(date.time));
                      }}
                    >
                      <em>{date.date}</em>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Index;
