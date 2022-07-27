import React, { useEffect } from 'react';
import styles from './style.module.css';
// import { BASE_URL } from '../../constants/api';
// import axios from '../../utils/token';

var alerts = [
  {
    id: 1,
    content: '어서와 달력에 초대되었어요',
    type: 'CalendarInvite',
  },
  {
    id: 1,
    content: '어서와 달력에 초대되었어요',
    type: 'CalendarInvite',
  },
  {
    id: 1,
    content: '어서와 달력에 초대되었어요',
    type: 'CalendarInvite',
  },
  {
    id: 1,
    content: '어서와 이벤트에 초대되었어요',
    type: 'event',
    eventCalendarId: 1,
    eventDate: '2022-02-20',
  },
  {
    id: 1,
    content: '어서와 이벤트가 삭제되었어요',
    type: 'eventRemoved',
    createdAt: '2022-02-20',
  },
];

const Index = () => {
  useEffect(() => {
    // axios
    //   .post(`${BASE_URL}/alert/getAlerts`, {
    //     page: 1,
    //   }) //aws 사용시 http://localhost:80/api 삭제
    //   .then(res => {
    //     console.log('성공', res);
    //   })
    //   .catch(error => {
    //     console.log('실패', error);
    //     if (error.response.status == 401) {
    //       alert(`아이디와 비밀번호를 확인해주세요.`);
    //     }
    //   });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.events}>
        {alerts.map(v => (
          <div key={v.id} className={styles.event}>
            <div>
              <div>2022/02/02</div>
              <div className={styles.content}>{v.content}</div>
            </div>

            {v.type === 'CalendarInvite' && (
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
