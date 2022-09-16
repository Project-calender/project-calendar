import React, { useEffect, useState } from 'react';
import axios from '../../../utils/token';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { USER_URL } from '../../../constants/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'; //폰트어썸

const Index = ({ inputValue, inputInitialization, handleInput }) => {
  let [userPasswordCheck, setUserPasswordCheck] = useState(false); //비밀번호 체크
  let [PasswordCheck, setPasswordCheck] = useState(false); //비밀번호 확인 체크

  //비밀번호 변경 함수
  function userChangePassword() {
    axios
      .post(USER_URL.USER_CHANGE_PASSWORD, {
        password: inputValue.userPassword,
      })
      .then(() => {
        alert('비밀번호 변경이 완료 되었습니다');
        inputInitialization();
      })
      .catch(error => {
        if (error.response.status == 500) {
          alert(`서버 에러`);
        }
      });
  }

  //비밀번호 특수문자 검사 정규표현식
  const specialLetter = inputValue.userPassword.search(
    /[`~!@#$%^&*|₩₩₩'₩";:₩/?]/gi,
  );

  //특수문자 1자 이상 전체 8장 이상시 ture 반환
  const validPassword =
    specialLetter >= 0 && inputValue.userPassword.length >= 8;

  //input ture,false 체크
  const inputCheck = () => {
    //비밀번호 유효성 검사 체크
    if (validPassword == true) {
      setUserPasswordCheck(true);
    } else {
      setUserPasswordCheck(false);
    }

    //비밀번호 확인 체크
    if (inputValue.userPassword == inputValue.userPasswordCheck) {
      setPasswordCheck(true);
    } else {
      setPasswordCheck(false);
    }
  };

  //input true,false 체크 함수 실행
  useEffect(() => {
    inputCheck();
  }, [inputValue]);

  return (
    <div className={`${styles.password} ${styles.change_input_box}`}>
      <label htmlFor="userPassword">비밀번호 변경</label>
      <div className={styles.password_wrap}>
        <div>
          <input
            type="password"
            placeholder="새 비밀번호"
            name="userPassword"
            id="userPassword"
            value={inputValue.userPassword || ''}
            onChange={e => {
              handleInput(e);
            }}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            name="userPasswordCheck"
            value={inputValue.userPasswordCheck || ''}
            onChange={e => {
              handleInput(e);
            }}
          />
        </div>
        <div>
          <button
            className={
              userPasswordCheck == true && PasswordCheck == true
                ? `${styles.active} ${styles.change_btt}`
                : styles.change_btt
            }
            onClick={e => {
              e.preventDefault();
              userChangePassword();
            }}
          >
            변경
          </button>
        </div>
      </div>
      <div>
        {userPasswordCheck == false ? (
          <div className={styles.warning}>
            <FontAwesomeIcon icon={faExclamationCircle} />
            <p>8자 이상,특수문자 + 영문,숫자를 입력해주세요</p>
          </div>
        ) : null}
        {PasswordCheck == false ? (
          <div className={styles.warning}>
            <FontAwesomeIcon icon={faExclamationCircle} />
            <p>비밀번호를 확인해주세요</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

Index.propTypes = {
  userInfo: PropTypes.object,
  userNameCheck: PropTypes.bool,
  inputValue: PropTypes.object,
  onUserInfo: PropTypes.func,
  inputInitialization: PropTypes.func,
  handleInput: PropTypes.func,
};

export default Index;
