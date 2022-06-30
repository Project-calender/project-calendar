import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import { useState } from 'react';

const Index = () => {
  let [closeBtt, setCloseBtt] = useState(true);
  let [closeClass, setCloseClass] = useState(``);

  function ClassChange() {
    if (closeBtt == true) {
      setCloseClass(`${styles.close}`);
      setCloseBtt(false);
    } else {
      setCloseClass(``);
    }
  }

  return (
    <div>
      <aside className={`${styles.side_bar} ${closeClass}`}>
        <div className={styles.side_bar_menu}>
          <ul>
            <li>
              <img
                src={`${process.env.PUBLIC_URL}/img/side_bar_icon1.png`}
                alt=""
              />
              <em>Keep</em>
            </li>
            <li>
              <img
                src={`${process.env.PUBLIC_URL}/img/side_bar_icon2.png`}
                alt=""
              />
              <em>Tasks</em>
            </li>
            <li>
              <img
                src={`${process.env.PUBLIC_URL}/img/side_bar_icon4.png`}
                alt=""
              />
              <em>주소록</em>
            </li>
            <li>
              <img
                src={`${process.env.PUBLIC_URL}/img/side_bar_icon5.png`}
                alt=""
              />
              <em>지도</em>
            </li>
          </ul>
          <span className={styles.line}></span>
          <div className={styles.install}>
            <img
              src={`${process.env.PUBLIC_URL}/img/side_bar_icon6.png`}
              alt=""
            />
            <em>부가기능 설치하기</em>
          </div>
        </div>
        <div
          className={styles.side_close}
          onClick={() => {
            setCloseBtt(true);
            ClassChange();
          }}
        >
          {closeBtt == true ? (
            <FontAwesomeIcon icon={faAngleRight} className={styles.icon} />
          ) : (
            <FontAwesomeIcon icon={faAngleLeft} className={styles.icon} />
          )}
          {closeBtt == true ? (
            <em>측면 패널 숨기기</em>
          ) : (
            <em>측면 패널 보이기</em>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Index;
