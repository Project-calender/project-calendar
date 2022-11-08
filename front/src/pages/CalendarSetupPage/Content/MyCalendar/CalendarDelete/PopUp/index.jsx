import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import { CALENDAR_URL } from '../../../../../../constants/api';
import axios from '../../../../../../utils/token';
import { useNavigate } from 'react-router-dom';
import usePopupClose from '../../../../../../hooks/usePopupClose';

const Index = ({
  targetItem,
  setTargetItem,
  calendarData,
  privateCalendar,
  setPopUpActive,
  setDefaultItem,
  setPrivateActive,
  setChangeName,
}) => {
  let popup = useRef();
  let navigate = useNavigate();
  let popupClose = usePopupClose(popup);

  function deleteCalendar() {
    axios
      .post(`${CALENDAR_URL.DELETE_CALENDAR}`, {
        calendarId: targetItem.id,
      })
      .then(res => {
        console.log('캘린더 삭제 성공', res);
        if (privateCalendar) {
          setTargetItem(privateCalendar[0]);
          setPrivateActive(-1);
          setDefaultItem(false);
          setPopUpActive(false);
          setChangeName(privateCalendar[0].name);
        } else {
          navigate('/');
          setPopUpActive(false);
        }
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

  return (
    <div
      className={styles.popup}
      onClick={() => {
        setPopUpActive(popupClose);
      }}
    >
      <div ref={popup}>
        <div className={styles.popup_content}>
          <p>
            모든 일정을 완전히 삭제하려고 합니다. 이 작업은 실행취소할 수
            없습니다. 계속하시겠습니까?
          </p>
          <div className={styles.btt_wrap}>
            <button
              className={styles.close}
              onClick={e => {
                e.stopPropagation();
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
  setTargetItem: PropTypes.func,
  calendarData: PropTypes.func,
  privateCalendar: PropTypes.array,
  setPopUpActive: PropTypes.func,
  setDefaultItem: PropTypes.func,
  setPrivateActive: PropTypes.func,
  setChangeName: PropTypes.func,
};

export default Index;
