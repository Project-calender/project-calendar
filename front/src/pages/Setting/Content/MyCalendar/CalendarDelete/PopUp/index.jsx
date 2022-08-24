import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import { CALENDAR_URL } from '../../../../../../constants/api';
import axios from '../../../../../../utils/token';

const Index = ({ targetItem, calendarData, setPopUpActive }) => {
  let popup = useRef();
  function deleteCalendar() {
    axios
      .post(`${CALENDAR_URL.DELETE_GROUP_CALENDAR}`, {
        calendarId: targetItem.id,
      })
      .then(res => {
        console.log('캘린더 삭제 성공', res);
        calendarData();
      })
      .catch(error => {
        if (error.response.status == 400) {
          alert(`권한이 없습니다!`);
        } else if (error.response.status == 500) {
          alert(`서버 에러`);
        }
      });
  }

  //팝업창 외부 클릭시 className 제거
  function clickModalOutside(event) {
    if (!popup.current.contains(event.target)) {
      setPopUpActive(false);
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside);
    return () => {
      document.removeEventListener('mousedown', clickModalOutside);
    };
  });

  return (
    <div className={styles.popup}>
      <div ref={popup}>
        <div className={styles.popup_content}>
          <p>
            모든 일정을 완전히 삭제하려고 합니다. 이 작업은 실행취소할 수
            없습니다. 계속하시겠습니까?
          </p>
          <div className={styles.btt_wrap}>
            <button
              className={styles.close}
              onClick={() => {
                setPopUpActive(false);
              }}
            >
              취소
            </button>
            <button
              className={styles.delete_btn}
              onClick={() => {
                deleteCalendar();
              }}
            >
              완전히 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Index.propTypes = {
  targetItem: PropTypes.object,
  calendarData: PropTypes.func,
  setPopUpActive: PropTypes.func,
};

export default Index;
