import React from 'react';
import styles from './style.module.css';
import { useEffect } from 'react';
import { useState } from 'react';
import NavBar from '../../components/Navbar';
import Sidebar from './Sidebar';
import Content from './Content';
import axios from '../../utils/token';
import { CALENDAR_URL } from '../../constants/api';

const Index = () => {
  let [MenuActive, setMenuActive] = useState(1); //Navbar 변경 / 1 = 기본, 2 = 검색, 3 = 설정
  let [privateCalendar, setPrivateCalendar] = useState(); // 내 캘린더 목록
  let [groupCalendars, setGroupCalendars] = useState(); // 다른 캘린더 목록
  let [targetItem, setTargetItem] = useState(); //선택된 캘린더 목록
  let [defaultItem, setDefaultItem] = useState(false); //개인 캘린더 여부 확인
  let [calendarSetting, setCalendarSetting] = useState(0); //내 캘린더의 설정 or 다른 캘린더의 설정 여부 확인
  let [defaultName, setDefaultName] = useState(); //첫 페이지 캘린더 이름 저장
  let [changeName, setChangeName] = useState(``); //캘린더 변경된 이름 저장
  let [item, setItem] = useState();

  //setting 페이지로 이동시 Navbar 3(설정)으로 변경
  useEffect(() => {
    setMenuActive(3);
    calendarData();
  }, []);

  function calendarData() {
    axios.get(`${CALENDAR_URL.GET_MY_CALENDARS}`).then(res => {
      onPrivate(res);
      onGroup(res);
    });
  }

  //권한 3 내 캘린더의 설정 목록
  function onPrivate(res) {
    let privateFilter = res.data.groupCalendars.filter(function (a) {
      return a.CalendarMember.authority == 3;
    });
    let newPrivate = [res.data.privateCalendar, ...privateFilter];
    setPrivateCalendar(newPrivate);
  }

  //권한 1~2 다른 캘린더의 설정 목록
  function onGroup(res) {
    let groupFilter = res.data.groupCalendars.filter(function (a) {
      return a.CalendarMember.authority < 3;
    });
    setGroupCalendars(groupFilter);
  }

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <NavBar MenuActive={MenuActive} setMenuActive={setMenuActive}></NavBar>
      </div>
      <div className={styles.wrap}>
        <div className={styles.side_bar}>
          <Sidebar
            privateCalendar={privateCalendar}
            groupCalendars={groupCalendars}
            targetItem={targetItem}
            setTargetItem={setTargetItem}
            defaultItem={defaultItem}
            setDefaultItem={setDefaultItem}
            setCalendarSetting={setCalendarSetting}
            setDefaultName={setDefaultName}
            setChangeName={setChangeName}
            setItem={setItem}
          ></Sidebar>
        </div>
        <div className={styles.content}>
          <Content
            targetItem={targetItem}
            calendarData={calendarData}
            privateCalendar={privateCalendar}
            defaultItem={defaultItem}
            calendarSetting={calendarSetting}
            defaultName={defaultName}
            setDefaultName={setDefaultName}
            setChangeName={setChangeName}
            changeName={changeName}
            item={item}
          ></Content>
        </div>
      </div>
    </div>
  );
};

export default Index;
