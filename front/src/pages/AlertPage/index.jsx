import React, { useEffect, useState } from 'react';
import { ALERT_URL, CALENDAR_URL } from '../../constants/api';
import axios from '../../utils/token';
import styles from './style.module.css';

const Index = () => {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    axios
      .post(ALERT_URL.GET_ALL_ALERT, {
        page: 1,
      }) //aws 사용시 http://localhost:80/api 삭제
      .then(({ data }) => {
        setAlerts(data);
      })
      .catch(error => {
        console.log('실패', error);
        if (error.response.status == 401) {
          alert(`아이디와 비밀번호를 확인해주세요.`);
        }
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.events}>
        {alerts.map(alert => (
          <div key={alert.id} className={styles.event}>
            <div>
              <div>2022/02/02</div>
              <div className={styles.content}>{alert.content}</div>
            </div>

            {alert.type === 'calendarInvite' && (
              <div className={styles.inviteBtns}>
                <div
                  className={styles.acceptInvite}
                  onClick={() => {
                    axios
                      .post(CALENDAR_URL.ACCEPT_CALENDAR_INVITE, {
                        calendarId: alert.calendarId,
                      })
                      .then(console.log);
                  }}
                >
                  수락
                </div>
                <div
                  className={styles.rejectInvite}
                  onClick={() => {
                    axios
                      .post(CALENDAR_URL.REJECT_CALENDAR_INVITE, {
                        calendarId: alert.calendarId,
                      })
                      .then(console.log);
                  }}
                >
                  거절
                </div>
              </div>
            )}
            {alert.type === 'event' && (
              <div
                className={styles.toEvent}
                onClick={() => {
                  console.log('a');
                }}
              >
                해당 이벤트로 가기
              </div>
            )}
          </div>
        ))}
        <div className={styles.pageBtn}>
          <div className={styles.prevPage}>이전</div>
          <div className={styles.nextPage}>다음</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
