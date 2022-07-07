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
    for (let i = 1; i <= 11; i++) {
      morningTime.push(`오전 ${i}시`);
    }
    for (let i = 1; i <= 11; i++) {
      afternoonTime.push(`오후 ${i}시`);
    }
    setTimeTable({
      year: state.year,
      month: state.month,
      date: state.date,
      morningTime: morningTime,
      afternoonTime: afternoonTime,
    });
  }, [state]);
  return (
    <div className={styles.today_talbe}>
      <table>
        <tbody>
          <tr>
            <th>
              <em></em>
            </th>
            <td></td>
          </tr>
          {timeTable.morningTime &&
            timeTable.morningTime.map((item, index) => {
              return (
                <tr key={index}>
                  <th>
                    <em>{item}</em>
                  </th>
                  <td></td>
                </tr>
              );
            })}
          <tr>
            <th>
              <em>오후 12시</em>
            </th>
            <td>
              <div className={styles.td_text}>
                <p>(제목 없음)</p>
                <p>오전 1시~2시</p>
              </div>
            </td>
          </tr>
          {timeTable.afternoonTime &&
            timeTable.afternoonTime.map((item, index) => {
              return (
                <tr key={index}>
                  <th>
                    <em>{item}</em>
                  </th>
                  <td></td>
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
