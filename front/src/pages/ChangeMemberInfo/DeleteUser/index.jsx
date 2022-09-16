import React from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_URL } from '../../../constants/api';
import { USER_PATH } from '../../../constants/path';
import axios from '../../../utils/token';
import styles from './style.module.css';

const Index = () => {
  let navigate = useNavigate();

  async function userDelete() {
    try {
      let res = await axios.post(USER_URL.USER_DELETE);
      console.log('회원 탈퇴 완료', res);
      localStorage.clear();
      sessionStorage.clear();
      navigate(USER_PATH.LOGIN);
    } catch (error) {
      console.log(error);
      if (error.response.status == 500) {
        alert(`서버 에러`);
      }
    }
  }

  return (
    <div className={styles.secession}>
      <button
        onClick={e => {
          e.preventDefault();
          userDelete();
        }}
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default Index;
