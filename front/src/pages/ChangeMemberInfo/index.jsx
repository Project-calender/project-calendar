import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import {
  faCameraRetro,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import Axios from 'axios';
import { BASE_URL, USER_URL } from '../../constants/api';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  let navigate = useNavigate();
  let [userImg, setUserImg] = useState(); //사용자 이미지 저장
  let [userInfo, setUserInfo] = useState(); //사용자 이미지 저장
  let [userNameCheck, setUserNameCheck] = useState(false); //이름 체크
  let [userPasswordCheck, setUserPasswordCheck] = useState(false); //비밀번호 체크
  let [PasswordCheck, setPasswordCheck] = useState(false); //비밀번호 확인 체크
  const [inputValue, setInputValue] = useState({
    userPassword: '',
    userPasswordCheck: '',
    userName: '',
  }); //변경 정보 저장

  //input file로 선택한 이미지를 DB로 보내기
  const onChangeImg = e => {
    const uploadFile = e.target.files[0];
    const formData = new FormData();
    formData.append('image', uploadFile);

    Axios.post(`${BASE_URL}${USER_URL.USER_PROFILE_IMAGE}`, formData)
      .then(res => {
        setUserImg(res.data.src);
      })
      .catch(error => {
        console.log('이미지 업로드실패', error);
      });
  };

  //비밀번호 특수문자 검사 정규표현식
  const specialLetter = inputValue.userPassword.search(
    /[`~!@#$%^&*|₩₩₩'₩";:₩/?]/gi,
  );

  //특수문자 1자 이상 전체 8장 이상시 ture 반환
  const validPassword =
    specialLetter >= 0 && inputValue.userPassword.length >= 8;

  //inputValue에게 input 값 넣기
  const handleInput = event => {
    const { name, value } = event.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

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

    //이름 2글자 이상 체크
    if (inputValue.userName.length >= 2) {
      setUserNameCheck(true);
    } else {
      setUserNameCheck(false);
    }
  };

  //input ture,false 체크 함수 실행
  useEffect(() => {
    inputCheck();
  }, [inputValue]);

  //로컬스토리지에서 로그인한 사용자 프로필 이미지 가지고 오기
  useEffect(() => {
    let getUserImg = localStorage.getItem('userImg');
    setUserImg(getUserImg);
    let userInfo = localStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    setUserInfo(userInfo);
  }, []);

  return (
    <div className={styles.container}>
      <nav className={styles.join_nav}>
        <em
          onClick={() => {
            navigate('/');
          }}
        >
          calendar
        </em>
      </nav>
      <div className={styles.wrap}>
        <div className={styles.profile_img}>
          <img src={userImg} alt="userProfileImage" />
          <div className={styles.profile_put}>
            <FontAwesomeIcon icon={faCameraRetro} className={styles.icon} />
            <input
              type="file"
              id="profile_upload"
              accept="image/*"
              onChange={e => {
                onChangeImg(e);
              }}
            />
          </div>
        </div>
        <div className={styles.profile_text}>
          <form>
            <div className={styles.change_input_box}>
              <label htmlFor="userName">이름 변경</label>
              <div>
                <input
                  type="text"
                  placeholder={userInfo && userInfo.nickname}
                  name="userName"
                  id="userName"
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
            <div className={`${styles.password} ${styles.change_input_box}`}>
              <label htmlFor="userPassword">비밀번호 변경</label>
              <div className={styles.password_wrap}>
                <div>
                  <input
                    type="password"
                    placeholder="새 비밀번호"
                    name="userPassword"
                    id="userPassword"
                    onChange={e => {
                      handleInput(e);
                    }}
                  />
                  <input
                    type="password"
                    placeholder="비밀번호 확인"
                    name="userPasswordCheck"
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
            <div className={styles.secession}>
              <button>회원 탈퇴</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
