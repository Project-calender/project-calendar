import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import axios from '../../../../../utils/token';
import { CALENDAR_URL } from '../../../../../constants/api';

const Index = ({
  targetItem,
  defaultName,
  setDefaultName,
  changeName,
  setChangeName,
  calendarData,
}) => {
  let calendarName = useRef(); //calendarName 선택
  let [nameClassActive, setNameClassActive] = useState(0);

  //input 외부 클릭시 className 제거
  function clickModalOutside(event) {
    if (!calendarName.current.contains(event.target)) {
      setNameClassActive(0);
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside);

    return () => {
      document.removeEventListener('mousedown', clickModalOutside);
    };
  });

  useEffect(() => {
    targetItem ? setDefaultName(targetItem.name) : null;
    setChangeName(targetItem && targetItem.name);
  }, [targetItem]);

  function onChangeName() {
    axios
      .post(CALENDAR_URL.UPDATE_CALENDAR, {
        calendarId: targetItem.id,
        calendarName: changeName,
        calendarColor: targetItem.color,
      })
      .then(res => {
        calendarData();
        setChangeName(res.data.name);
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
    <div>
      <div id="1" className={styles.calendar_set}>
        <h3>캘린더 설정</h3>
        <div
          className={
            nameClassActive == 1
              ? `${styles.calendar_name} ${styles.active}`
              : styles.calendar_name
          }
          onClick={() => {
            setNameClassActive(1);
          }}
          ref={calendarName}
        >
          <input
            type="text"
            placeholder={defaultName}
            value={changeName || ''}
            onChange={e => {
              setChangeName(e.target.value);
            }}
          />
          <em>이름</em>
        </div>
        <button
          className={styles.change_name}
          onClick={() => {
            onChangeName();
          }}
        >
          저장
        </button>
      </div>
    </div>
  );
};

Index.propTypes = {
  targetItem: PropTypes.object,
  calendarData: PropTypes.func,
  defaultName: PropTypes.string,
  setDefaultName: PropTypes.func,
  changeName: PropTypes.string,
  setChangeName: PropTypes.func,
  privateCalendar: PropTypes.array,
};

export default Index;
