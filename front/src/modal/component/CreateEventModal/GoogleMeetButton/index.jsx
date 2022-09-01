import React from 'react';
import styles from './style.module.css';

const Index = () => {
  return (
    <div className={styles.google_meet}>
      <img
        className={styles.google_meet_img}
        src={`${process.env.PUBLIC_URL}/img/google_meet_icon.png`}
        alt="구글 미팅"
      />
      <button>
        <b>Google Meet</b> 화상 회의 추가
      </button>
    </div>
  );
};

export default Index;
