import React, { useEffect, useState } from 'react';
import axios from '../../../utils/token';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { USER_URL } from '../../../constants/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'; //폰트어썸

const Index = ({
  userInfo,
  inputValue,
  onUserInfo,
  inputInitialization,
  handleInput,
}) => {
  let [userNameCheck, setUserNameCheck] = useState(false); //이름 체크
  //닉네임 변경 함수
  function userChangeName() {
    axios
      .post(USER_URL.USER_CHANGE_NAME, {
        nickname: inputValue.userName,
      })
      .then(res => {
        alert('닉네임 변경이 완료 되었습니다');
        const { email, id, nickname } = res.data;
        localStorage.setItem(
          'userInfo',
          JSON.stringify({ email, id, nickname }),
        );
        onUserInfo();
        inputInitialization();
      })
      .catch(error => {
        console.log(error);
        if (error.response.status == 500) {
          alert(`서버 에러`);
        }
      });
  }

  //input ture,false 체크
  const inputCheck = () => {
    //이름 2글자 이상 체크
    if (inputValue.userName.length >= 2) {
      setUserNameCheck(true);
    } else {
      setUserNameCheck(false);
    }
  };

  //input true,false 체크 함수 실행
  useEffect(() => {
    inputCheck();
  }, [inputValue]);

  return (
    <div className={styles.change_input_box}>
      <label htmlFor="userName">이름 변경</label>
      <div>
        <input
          type="text"
          placeholder={userInfo && userInfo.nickname}
          name="userName"
          id="userName"
          value={inputValue.userName || ''}
          onChange={e => {
            handleInput(e);
          }}
        />
        <button
          className={
            userNameCheck == true
              ? `${styles.active} ${styles.change_btt}`
              : styles.change_btt
          }
          onClick={e => {
            e.preventDefault();
            userChangeName();
          }}
        >
          변경
        </button>
      </div>
      {userNameCheck == false ? (
        <div className={styles.warning}>
          <FontAwesomeIcon icon={faExclamationCircle} />
          <p>이름을 입력해주세요</p>
        </div>
      ) : null}
    </div>
  );
};

Index.propTypes = {
  userInfo: PropTypes.object,
  inputValue: PropTypes.object,
  onUserInfo: PropTypes.func,
  inputInitialization: PropTypes.func,
  handleInput: PropTypes.func,
};

export default Index;
