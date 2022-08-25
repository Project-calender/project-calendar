import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import axios from '../../../../../utils/token';
import { CALENDAR_URL } from '../../../../../constants/api';

const Index = ({ targetItem, calendarData }) => {
  //구독 취소 함수
  function calendarSecession() {
    axios
      .post(`${CALENDAR_URL.RESIGN_CALENDAR}`, {
        calendarId: targetItem.id,
      })
      .then(res => {
        console.log('구독 취소 완료', res);
        calendarData();
      })
      .catch(error => {
        if (error.response.status == 400) {
          alert(`존재하지 않는 캘린더 입니다!`);
        } else if (error.response.status == 500) {
          alert(`서버 에러`);
        }
      });
  }
  return (
    <div id="5" className={styles.subscribe}>
      <h3>캘린더 삭제</h3>
      <p>구독을 취소하면 더 이상 이 캘린더에 액세스할 수 없습니다. </p>
      <button
        onClick={() => {
          calendarSecession();
        }}
      >
        구독 취소
      </button>
    </div>
  );
};

Index.propTypes = {
  targetItem: PropTypes.object,
  calendarData: PropTypes.func,
};

export default Index;
