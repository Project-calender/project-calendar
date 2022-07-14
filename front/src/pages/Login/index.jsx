import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import { CALENDAR_URL } from './../../constants/path';
import { useEffect } from 'react';
import axios from '../../utils/token';

const Index = () => {
  let navigate = useNavigate();

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
    axios
      .post('/api/user/signin', loginData)
      .then(res => {
        console.log('성공', res);
        saveWebStorage(res);
        navigate(`${CALENDAR_URL.DAY}`);
      })
      .catch(error => {
        console.log('실패', error);
        if (error.response.status == 401) {
          alert(`아이디와 비밀번호를 확인해주세요.`);
        }
      });
    // instance
    //   .post(`/api/user/signin`, loginData)
    //   .then(res => {
    //     console.log('성공', res);
    //     saveWebStorage(res);
    //     navigate(`${CALENDAR_URL.DAY}`);
    //   })
    //   .catch(error => {
    //     console.log('실패', error);
    //     if (error.response.status == 401) {
    //       alert(`아이디와 비밀번호를 확인해주세요.`);
    //     }
    //   });
  }

  //웹 스토리지에 사용자 정보, 토큰 저장 함수
  function saveWebStorage(res) {
    localStorage.setItem('refreshToken', JSON.stringify(res.data.refreshToken));
    sessionStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));
    localStorage.setItem('userInfo', JSON.stringify(res.data.userData));
  }

  useEffect(() => {
    sessionStorage.getItem('accessToken')
      ? navigate(`${CALENDAR_URL.DAY}`)
      : null;
  }, []);

  return (
    <div>
      <section className={styles.section}>
        <div className={styles.login_wrap}>
          <div className={styles.login}>
            <h2>Login</h2>
            <p>If You Are Already aA Member, Easily Log In</p>
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
              <div className={styles.line_wrpa}>
                <span></span>
                <em>OR</em>
                <span></span>
              </div>
              <button className={styles.google_btt}>
                <img
                  src={`${process.env.PUBLIC_URL}/img/login/google_logo.png`}
                  alt="google_icon"
                />
                Login with Google
              </button>
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
            </form>
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
