import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './style.module.css';
import NavBar from '../../components/Navbar';
import Calendar from '../../components/calendar';

const Index = () => {
  /* NavBar */
  let [activeClass, setActiveClass] = useState(); //일정 리스트에 클레스 추가
  let [dateActive, setDateActive] = useState(false); //일정 리스트 true ,false 확인
  let [userClassAdd, setUserClassAdd] = useState(); //일정 리스트에 클레스 추가
  let [userActive, setUserActive] = useState(false); //일정 리스트 true ,false 확인
  //body클릭시 일정 리스트 모달창 닫기
  document.body.addEventListener('click', () => {
    setDateActive(false);
    setActiveClass(``);
    setUserActive(false);
    setUserClassAdd(``);
  });

  return (
    <div>
      <section className={styles.section}>
        <NavBar
          activeClass={activeClass}
          setActiveClass={setActiveClass}
          dateActive={dateActive}
          setDateActive={setDateActive}
          userClassAdd={userClassAdd}
          setUserClassAdd={setUserClassAdd}
          userActive={userActive}
          setUserActive={setUserActive}
        ></NavBar>
        <div>
          <Calendar></Calendar>
          <Outlet></Outlet>
        </div>
      </section>
    </div>
  );
};

export default Index;
