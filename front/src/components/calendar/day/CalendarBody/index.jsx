import React from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useState } from 'react';
import styles from './style.module.css';

const Index = ({ state }) => {
  let [timeTable, setTimeTable] = useState({}); //현재 날짜 저장 및 시간 저장

  //오전,오후 시간 생성
  useEffect(() => {
    let morningTime = [];
    let afternoonTime = [];
    for (let i = 0; i <= 11; i++) {
      morningTime.push(`오전 ${i}시`);
    }
    for (let i = 1; i <= 11; i++) {
      afternoonTime.push(`오후 ${i}시`);
    }
    setTimeTable({
      year: state.year,
      month: state.month,
      date: state.date,
      time: [...morningTime, '오후 12시', ...afternoonTime],
    });
  }, [state]);

  return (
    <div className={styles.today_talbe}>
      <table>
        <tbody>
          {timeTable.time &&
            timeTable.time.map((item, index) => {
              return (
                <tr key={index}>
                  <th>
                    <em>{item}</em>
                  </th>
                  <td data-item={index}>
                    <div className={styles.td_text}></div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
Index.propTypes = {
  state: PropTypes.object,
};

export default Index;
