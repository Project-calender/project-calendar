import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ALERT_URL, CALENDAR_URL } from '../../constants/api';
import axios from '../../utils/token';
import styles from './style.module.css';

const Index = ({ setNotice }) => {
  const [alerts, setAlerts] = useState([]);
  let notice = useRef(); //알림창
  let [pageNumber, setPageNumber] = useState(1); //현재 페이지

  useEffect(() => {
    onNotice(pageNumber);
  }, [pageNumber]);

  //알림 요청
  function onNotice(pageNumber) {
    axios
      .post(ALERT_URL.GET_ALL_ALERT, {
        page: pageNumber,
      })
      .then(({ data }) => {
        setAlerts(data);
        console.log(data);
      })
      .catch(error => {
        console.log('실패', error);
        if (error.response.status == 401) {
          alert(`아이디와 비밀번호를 확인해주세요.`);
        }
      });
  }

  //수락 완료시 알림 읽음
  function noticeRead(alertNum) {
    axios
      .post(`/alert/read`, {
        alertId: alertNum,
      })
      .then(res => {
        console.log(res.status);
      });
  }

  //알림창 외부 클릭시 알림창 닫기
  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside);

    return () => {
      document.removeEventListener('mousedown', clickModalOutside);
    };
  });

  //알림창 외부 클릭시 알림창 닫기
  function clickModalOutside(event) {
    if (!notice.current.contains(event.target)) {
      setNotice(false);
    }
  }

  return (
    <div ref={notice} className={styles.container}>
      <div className={styles.content}>
        <div className={styles.events}>
          {alerts.map(alert => (
            <div key={alert.id} className={styles.event}>
              <div>
                <div>{alert.createdAt.substring(0, 10)}</div>
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
                        .then(res => {
                          console.log(res);
                          noticeRead(alert.id);
                        });
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
            <div
              className={
                pageNumber <= 1
                  ? `${styles.active} ${styles.prevPage}`
                  : styles.prevPage
              }
              onClick={() => {
                setPageNumber(pageNumber - 1);
              }}
            >
              <em>이전</em>
            </div>
            <div
              className={styles.nextPage}
              onClick={() => {
                setPageNumber(pageNumber + 1);
              }}
            >
              <em>다음</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Index.propTypes = {
  setNotice: PropTypes.func,
};

export default Index;
