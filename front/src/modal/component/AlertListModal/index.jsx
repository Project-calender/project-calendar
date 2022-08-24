import React, { useEffect, useState, useCallback } from 'react';
import styles from './style.module.css';
import { BASE_URL } from '../../../constants/api';
import { CALENDAR_PATH } from '../../../constants/path';
import dayjs from 'dayjs';
import axios from '../../../utils/token';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  let navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  console.log(alerts);
  useEffect(() => {
    axios
      .post(`${BASE_URL}/alert/getAlerts`, { page: 1 })
      .then(res => {
        setAlerts(res.data);
      })
      .catch(error => {
        console.log('실패', error);
        if (error.response.status == 401) {
          alert(`아이디와 비밀번호를 확인해주세요.`);
        }
      });
  }, []);

  const readAlert = useCallback(() => {
    axios
      .post(`${BASE_URL}/alert/getAlerts`, { page: 1 })
      .then(res => {
        setAlerts(res.data);
      })
      .catch(error => {
        console.log('실패', error);
        if (error.response.status == 401) {
          alert(`아이디와 비밀번호를 확인해주세요.`);
        }
      });
  }, []);

  const toAlertPage = useCallback(() => {
    navigate(CALENDAR_PATH.ALERT);
  }, []);

  return (
    <div className={styles.events}>
      {alerts.map(v => (
        <div
          onClick={readAlert}
          key={v.id}
          className={v.checked ? styles.checkedEvent : styles.event}
        >
          <div>
            <div className={styles.date}>
              {dayjs(v.createdAt).format('YYYY.MM.DD')}
            </div>
            <div className={styles.bottom}>
              <div className={styles.content}>{v.content}</div>

              {v.type === 'calendarInvite' && (
                <div className={styles.inviteBtns}>
                  <div className={styles.acceptInvite}>수락</div>
                  <div className={styles.rejectInvite}>거절</div>
                </div>
              )}
              {v.type === 'event' && (
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
          </div>
        </div>
      ))}
      <div className={styles.toAlertPage} onClick={toAlertPage}>
        알림 모두 보기
      </div>
    </div>
  );
};

export default Index;
