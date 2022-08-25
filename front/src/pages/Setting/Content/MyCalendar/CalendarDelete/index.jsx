import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';

import styles from './style.module.css';
import PopUp from './PopUp';

const Index = ({
  targetItem,
  setTargetItem,
  calendarData,
  privateCalendar,
  setDefaultItem,
  setPrivateActive,
  setChangeName,
}) => {
  let [popUpActive, setPopUpActive] = useState(false);

  return (
    <div id="3" className={styles.container}>
      <div className={styles.content}>
        <h3>캘린더 삭제</h3>
        <p>
          이 캘린더의 모든 일정이 삭제됩니다. 일정에 참석자가 있는 경우 참석자의
          캘린더에서도 일정이 삭제됩니다.
        </p>
        <button
          className={styles.delete_btt}
          onClick={() => {
            setPopUpActive(true);
          }}
        >
          삭제
        </button>
      </div>
      {popUpActive == true ? (
        <PopUp
          targetItem={targetItem}
          setTargetItem={setTargetItem}
          calendarData={calendarData}
          privateCalendar={privateCalendar}
          setPopUpActive={setPopUpActive}
          setDefaultItem={setDefaultItem}
          setPrivateActive={setPrivateActive}
          setChangeName={setChangeName}
        ></PopUp>
      ) : null}
    </div>
  );
};

Index.propTypes = {
  targetItem: PropTypes.object,
  setTargetItem: PropTypes.func,
  calendarData: PropTypes.func,
  setDefaultItem: PropTypes.func,
  privateCalendar: PropTypes.array,
  setPrivateActive: PropTypes.func,
  setChangeName: PropTypes.func,
};

export default Index;
