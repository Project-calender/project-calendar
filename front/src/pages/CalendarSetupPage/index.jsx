import React from 'react';
import styles from './style.module.css';
import { useEffect } from 'react';
import { useState } from 'react';
import NavBar from '../../components/Navbar';
import Sidebar from './Sidebar';
import Content from './Content';
import axios from '../../utils/token';
import { CALENDAR_URL } from '../../constants/api';
import { useLocation, useNavigate } from 'react-router-dom';

const Index = () => {
  let navigate = useNavigate();
  let [MenuActive, setMenuActive] = useState(1); //Navbar 변경 / 1 = 기본, 2 = 검색, 3 = 설정
  let [privateCalendar, setPrivateCalendar] = useState([]); // 내 캘린더 목록
  let [groupCalendars, setGroupCalendars] = useState([]); // 다른 캘린더 목록
  let [targetItem, setTargetItem] = useState(); //선택된 캘린더 목록
  let [defaultItem, setDefaultItem] = useState(false); //개인 캘린더 여부 확인
  let [calendarSetting, setCalendarSetting] = useState(0); //내 캘린더의 설정 or 다른 캘린더의 설정 여부 확인
  let [defaultName, setDefaultName] = useState(); //첫 페이지 캘린더 이름 저장
  let [changeName, setChangeName] = useState(''); //캘린더 변경된 이름 저장
  let [item, setItem] = useState();
  let [privateActive, setPrivateActive] = useState(1); // 내 캘린더의 설정 className 추가
  let [groupActive, setGroupActive] = useState(-1); // 다른 캘린더의 설정 className 추가
  const { state } = useLocation();
  let userImg = localStorage.getItem('userImg'); //사용자 프로필 이미지 가지고 오기

  /*
  if (userImg == undefined) {
    navigate('/login');
  }
  */

  //캘린더 목록에서 설정 변경시 targetItem 변경
  function onChangeTargetItem() {
    if (!state?.calendar) {
      setTargetItem(privateCalendar[0]);
      setPrivateActive(0);
      setDefaultItem(false);
      return;
    }

    let myCalendar = privateCalendar.findIndex(item => {
      return state.calendar.private || state.calendar.id === item.id;
    });

    let anotherCalendar = groupCalendars.findIndex(item => {
      return state.calendar.id === item.id;
    });

    if (myCalendar != -1) {
      if (state.calendar.private) {
        setDefaultItem(false);
      } else {
        setDefaultItem(true);
      }
      setTargetItem(privateCalendar[myCalendar]);
      setPrivateActive(myCalendar);
    }

    if (anotherCalendar != -1) {
      setTargetItem(groupCalendars[anotherCalendar]);
      setGroupActive(anotherCalendar);
      setPrivateActive(-1);
      setDefaultItem(true);
      setCalendarSetting(1);
    }
  }

  useEffect(() => {
    onChangeTargetItem();
  }, [privateCalendar]);

  //setting 페이지로 이동시 Navbar 3(설정)으로 변경
  useEffect(() => {
    setMenuActive(3);
    calendarData();
    if (userImg == null) {
      navigate('/login');
    }
  }, []);

  async function calendarData() {
    const { data } = await axios.get(`${CALENDAR_URL.GET_ALL_CALENDAR}`);
    console.log(data);
    onPrivate(data);
    onGroup(data);
  }

  //권한 3 내 캘린더의 설정 목록
  function onPrivate(calendars) {
    const privateFilter = calendars.filter(isManager);
    setPrivateCalendar(privateFilter);
  }

  //권한 1~2 다른 캘린더의 설정 목록
  function onGroup(calendars) {
    const groupFilter = calendars.filter(calendar => !isManager(calendar));
    setGroupCalendars(groupFilter);
  }

  function isManager(calendar) {
    return calendar.authority === 3;
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
            privateActive={privateActive}
            setPrivateActive={setPrivateActive}
            groupActive={groupActive}
            setGroupActive={setGroupActive}
          ></Sidebar>
        </div>
        <div className={styles.content}>
          <Content
            targetItem={targetItem}
            setTargetItem={setTargetItem}
            calendarData={calendarData}
            privateCalendar={privateCalendar}
            defaultItem={defaultItem}
            calendarSetting={calendarSetting}
            defaultName={defaultName}
            setDefaultName={setDefaultName}
            setChangeName={setChangeName}
            changeName={changeName}
            item={item}
            setItem={setItem}
            setDefaultItem={setDefaultItem}
            setPrivateActive={setPrivateActive}
          ></Content>
        </div>
      </div>
    </div>
  );
};

export default Index;
