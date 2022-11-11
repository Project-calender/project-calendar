import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import { CALENDAR_PATH } from './../../constants/path';
import Axios from 'axios';
import { BASE_URL, USER_URL } from '../../constants/api';

const Index = () => {
  let navigate = useNavigate();
  localStorage.setItem('refuseCheck', JSON.stringify(true)); //로컬스토리지에 일정 거절 저장

  //로그인 input 값 저장
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
  });

  //ajax 데이터
  const loginData = { ...inputValue };

  //input에 입력된 값을 inputValue에 저장
  const handleInput = event => {
    const { name, value } = event.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  function sendLoginForm() {
    Axios.post(`${BASE_URL}${USER_URL.LOGIN}`, loginData) //aws 사용시 http://localhost:80/api 삭제
      .then(res => {
        console.log('성공', res);
        saveWebStorage(res);
        navigate(`${CALENDAR_PATH.MAIN}`);
      })
      .catch(error => {
        console.log('실패', error);
        if (error.response.status == 401) {
          alert(`존재하지 않는 유저 입니다. 아이디를 확인해주세요.`);
        } else if (error.response.status == 402) {
          alert(`비밀번호가 일치하지 않습니다. 비밀번호를 확인해주세요.`);
        }
      });
  }

  //웹 스토리지에 사용자 정보, 토큰 저장 함수
  function saveWebStorage(res) {
    localStorage.setItem('refreshToken', JSON.stringify(res.data.refreshToken));
    sessionStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));

    const { email, id, nickname, checkedCalendar, ProfileImages } =
      res.data.userData;
    localStorage.setItem('userInfo', JSON.stringify({ email, id, nickname }));
    localStorage.setItem('checkedCalendar', checkedCalendar);
    localStorage.setItem('userImg', ProfileImages[0].src);
    localStorage.setItem('local', JSON.stringify(res.data.local));
  }

  const KAKAO_AUTH_URL = `http://www.groupcalendars.shop/api/auth/kakao`;
  const NAVER_AUTH_URL = `http://www.groupcalendars.shop/api/auth/naver`;
  const GOOGLE_AUTH_URL = `http://www.groupcalendars.shop/api/auth/google`;

  return (
    <div>
      <section className={styles.section}>
        <div className={styles.login_wrap}>
          <div className={styles.login}>
            <h2>Login</h2>
            <p>If You Are Already aA Member, Easily Log In</p>
            <div>
              <form>
                <div className={`${styles.id} ${styles.login_input_box}`}>
                  <input
                    type="text"
                    placeholder="User Email"
                    name="email"
                    onChange={e => {
                      handleInput(e);
                    }}
                  />
                </div>
                <div className={`${styles.password} ${styles.login_input_box}`}>
                  <input
                    type="password"
                    placeholder="User Password"
                    name="password"
                    onChange={e => {
                      handleInput(e);
                    }}
                  />
                </div>
                <button
                  className={styles.login_btt}
                  onClick={e => {
                    e.preventDefault();
                    sendLoginForm();
                  }}
                >
                  Login
                </button>
              </form>
              <div className={styles.line_wrap}>
                <span></span>
                <em>OR</em>
                <span></span>
              </div>
              <div className={styles.social_login}>
                <button className={styles.social_login_btt}>
                  <a id="kakao" href={KAKAO_AUTH_URL}>
                    {/* ${process.env.PUBLIC_URL}/ */}
                    <img
                      src={`${process.env.PUBLIC_URL}/img/login/kakao_logo.png`}
                      alt="kakao_icon"
                    />
                    <em>Login with Kakao</em>
                  </a>
                </button>
                <button className={styles.social_login_btt}>
                  <a href={NAVER_AUTH_URL}>
                    <img
                      src={`${process.env.PUBLIC_URL}/img/login/naver_logo.png`}
                      alt="naver_icon"
                    />
                    <em>Login with Naver</em>
                  </a>
                </button>
                <button className={styles.social_login_btt}>
                  <a href={GOOGLE_AUTH_URL}>
                    <img
                      src={`${process.env.PUBLIC_URL}/img/login/google_logo.png`}
                      alt="google_icon"
                    />
                    <em>Login with Google</em>
                  </a>
                </button>
              </div>
              <div className={styles.tooltip}>
                <p>Forgot my password</p>
                <span></span>
                <p
                  onClick={() => {
                    navigate('/join');
                  }}
                >
                  If You Don’t Have An Account, Create
                </p>
              </div>
            </div>
          </div>
          <div className={styles.login_img}>
            <img
              src={`${process.env.PUBLIC_URL}/img/login/login_img.png`}
              alt="login_img"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
