import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import { useNavigate } from 'react-router-dom';
import ChangeName from './ChangeName';
import ChangePswd from './ChangePswd';
import ChangeImage from './ChangeImage';
import DeleteUser from './DeleteUser';

const Index = () => {
  let navigate = useNavigate();
  let [userImg, setUserImg] = useState(); //사용자 이미지 저장
  let [userInfo, setUserInfo] = useState(); //사용자 정보 저장

  const [inputValue, setInputValue] = useState({
    userPassword: '',
    userPasswordCheck: '',
    userName: '',
  }); //변경 정보 저장

  //input 초기화
  function inputInitialization() {
    setInputValue({
      userPassword: ``,
      userPasswordCheck: ``,
      userName: ``,
    });
  }

  //사용자 정보 저장
  function onUserInfo() {
    let userInfo = localStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    setUserInfo(userInfo);
  }

  //inputValue에게 input 값 넣기
  const handleInput = event => {
    const { name, value } = event.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  //로컬스토리지에서 로그인한 사용자 프로필 이미지, 정보 가지고 오기
  useEffect(() => {
    let getUserImg = localStorage.getItem('userImg');
    setUserImg(getUserImg);
    onUserInfo();
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
        <ChangeImage userImg={userImg} setUserImg={setUserImg}></ChangeImage>
        <div className={styles.profile_text}>
          <form>
            <ChangeName
              userInfo={userInfo}
              inputValue={inputValue}
              onUserInfo={onUserInfo}
              inputInitialization={inputInitialization}
              handleInput={handleInput}
            ></ChangeName>
            <ChangePswd
              inputValue={inputValue}
              inputInitialization={inputInitialization}
              handleInput={handleInput}
            ></ChangePswd>
            <DeleteUser></DeleteUser>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
