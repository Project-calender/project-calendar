import React from 'react';
import styles from './style.module.css';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Index = ({ toggleSideBar }) => {
  let [activeClass, setActiveClass] = useState(); //일정 리스트에 클레스 추가
  let [dateActive, setDateActive] = useState(false); //일정 리스트 true ,false 확인
  let [userClassAdd, setUserClassAdd] = useState(); //사용자 팝업창에 class 추가
  let [userActive, setUserActive] = useState(false); //사용자 팝업창 true ,false 확인
  return (
    <div>
      <nav className={styles.nav}>
        <div className={styles.menu_wrap}>
          <LeftMenu toggleSideBar={toggleSideBar}></LeftMenu>
          <RightMenu
            activeClass={activeClass}
            setActiveClass={setActiveClass}
            dateActive={dateActive}
            setDateActive={setDateActive}
            userClassAdd={userClassAdd}
            setUserClassAdd={setUserClassAdd}
            userActive={userActive}
            setUserActive={setUserActive}
          ></RightMenu>
        </div>
      </nav>
    </div>
  );
};
Index.propTypes = {
  toggleSideBar: PropTypes.func,
};

export default Index;
