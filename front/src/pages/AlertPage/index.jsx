import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ALERT_URL, CALENDAR_URL } from '../../constants/api';
import axios from '../../utils/token';
import styles from './style.module.css';
import usePopupClose from '../../hooks/usePopupClose';

const Index = ({ setNotice }) => {
  const [alerts, setAlerts] = useState([]);
  let notice = useRef(); //알림창
  let [totalPage, setTotalPage] = useState(0); //알림 총 페이지 수
  let [pageNumber, setPageNumber] = useState(1); //현재 알림 페이지
  let popupClose = usePopupClose(notice);

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
        setAlerts(data.alerts);
        let page = Math.ceil(data.count / 8);
        setTotalPage(page);
      })
      .catch(error => {
        console.log('실패', error);
        if (error.response.status == 401) {
          alert(`아이디와 비밀번호를 확인해주세요.`);
        }
      });
  }

  //알림 읽음
  function noticeRead(alertNum) {
    axios
      .post('/alert/read', {
        alertId: alertNum,
      })
      .then(() => {
        onNotice(pageNumber);
      });
  }

  return (
    <div
      className={styles.AlertPage}
      onClick={() => {
        setNotice(popupClose);
      }}
    >
      <div ref={notice} className={styles.container}>
        <div className={styles.content}>
          <div className={styles.events}>
            {totalPage == 0 ? (
              <p className={styles.notice_check}>알림이 없습니다.</p>
            ) : null}
            {alerts &&
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={
                    alert.checked == true
                      ? `${styles.active} ${styles.event}`
                      : styles.event
                  }
                >
                  <div>
                    <div>{alert.createdAt.substring(0, 10)}</div>
                    <div className={styles.content}>{alert.content}</div>
                  </div>
                  {alert.type === 'calendarInvite' && (
                    <div className={styles.inviteBtns}>
                      {alert.checked == false ? (
                        <div
                          className={styles.acceptInvite}
                          onClick={() => {
                            axios
                              .post(CALENDAR_URL.ACCEPT_CALENDAR_INVITE, {
                                calendarId: alert.calendarId,
                                alertId: alert.id,
                              })
                              .then(res => {
                                console.log('수락', res);
                                onNotice(pageNumber);
                              });
                          }}
                        >
                          <em>수락</em>
                        </div>
                      ) : null}
                      {alert.checked == false ? (
                        <div
                          className={styles.rejectInvite}
                          onClick={() => {
                            axios
                              .post(CALENDAR_URL.REJECT_CALENDAR_INVITE, {
                                calendarId: alert.calendarId,
                                alertId: alert.id,
                              })
                              .then(() => {
                                onNotice(pageNumber);
                              });
                          }}
                        >
                          <em>거절</em>
                        </div>
                      ) : null}
                    </div>
                  )}
                  {alert.type === 'calendarInviteReject' ||
                  alert.type === 'eventRemoved' ||
                  alert.type === 'event' ||
                  alert.type === 'calendarInviteReject' ||
                  alert.type === 'calenderChanged' ||
                  alert.type === 'calenderNewMember' ? (
                    <div className={styles.inviteBtns}>
                      {alert.checked == false ? (
                        <div
                          className={styles.acceptInvite}
                          onClick={() => {
                            noticeRead(alert.id);
                          }}
                        >
                          <em>알림 확인</em>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            <div className={styles.pageBtn}>
              <div
                className={
                  pageNumber <= 1
                    ? `${styles.visible} ${styles.prevPage}`
                    : styles.prevPage
                }
                onClick={() => {
                  setPageNumber(pageNumber - 1);
                }}
              >
                <em>이전</em>
              </div>
              <div
                className={
                  pageNumber >= totalPage
                    ? `${styles.visible} ${styles.nextPage}`
                    : styles.nextPage
                }
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
    </div>
  );
};

Index.propTypes = {
  setNotice: PropTypes.func,
};

export default Index;
