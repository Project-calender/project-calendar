import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './style.module.css';
import { useEffect } from 'react';
import { Link } from 'react-scroll';

const Index = ({
  privateCalendar,
  groupCalendars,
  targetItem,
  setTargetItem,
  defaultItem,
  setDefaultItem,
  setCalendarSetting,
  setDefaultName,
  setChangeName,
  setItem,
  privateActive,
  setPrivateActive,
  groupActive,
  setGroupActive,
}) => {
  let [privateListActive, setPrivateListActive] = useState(1); //내 캘린더 목록의 리스트 목록에게 className 추가
  let [groupListActive, setGroupListActive] = useState(1); //다른 캘린더 목록의 리스트 목록에게 className 추가

  useEffect(() => {
    let copy = { ...privateCalendar };
    setItem(copy[0]);
    onDefaultName();
  }, [privateCalendar]);

  //첫 페이지 캘린더 이름 저장
  function onDefaultName() {
    setDefaultName(privateCalendar[0]?.name);
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [targetItem]);

  return (
    <div>
      <aside className={styles.side_bar}>
        <div className={`${styles.my_calendar} ${styles.calendar}`}>
          <h2>내 캘린더의 설정</h2>
          <ul>
            {privateCalendar &&
              privateCalendar.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={
                      privateActive == index ? `${styles.active}` : null
                    }
                    onClick={() => {
                      setPrivateActive(index);
                      privateActive == index ? setPrivateActive(-1) : null;
                      setPrivateListActive(1);
                      setGroupActive(-1);
                      setTargetItem(item);
                      setCalendarSetting(0);
                      !item.Owner
                        ? setDefaultItem(false)
                        : setDefaultItem(true);
                      setChangeName(``);
                      setItem(item);
                    }}
                  >
                    <div className={`${styles.calendar_name}`}>
                      <span style={{ background: `${item.color}` }}></span>
                      <em>{item.name}</em>
                    </div>
                    <ul className={styles.setting_list}>
                      <li
                        className={
                          privateListActive == 1 ? `${styles.active}` : null
                        }
                      >
                        <Link to="1" offset={-90} spy={true} smooth={true}>
                          <em
                            onClick={() => {
                              setPrivateListActive(1);
                            }}
                          >
                            캘린더 설정
                          </em>
                        </Link>
                      </li>
                      {defaultItem == true ? (
                        <li
                          className={
                            privateListActive == 2 ? `${styles.active}` : null
                          }
                        >
                          <Link to="2" offset={-80} spy={true} smooth={true}>
                            <em
                              onClick={() => {
                                setPrivateListActive(2);
                              }}
                            >
                              특정 사용자와 공유
                            </em>
                          </Link>
                        </li>
                      ) : null}
                      {defaultItem == true ? (
                        <li
                          className={
                            privateListActive == 3 ? `${styles.active}` : null
                          }
                        >
                          <Link to="3" spy={true} smooth={true}>
                            <em
                              onClick={() => {
                                setPrivateListActive(3);
                              }}
                            >
                              캘린더 삭제
                            </em>
                          </Link>
                        </li>
                      ) : null}
                    </ul>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className={`${styles.another_calendar} ${styles.calendar}`}>
          <h2>다른 캘린더의 설정</h2>
          <ul>
            {groupCalendars &&
              groupCalendars.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={groupActive == index ? `${styles.active}` : null}
                    onClick={() => {
                      setGroupActive(index);
                      groupActive == index ? setGroupActive(-1) : null;
                      setGroupListActive(1);
                      setPrivateActive(-1);
                      setTargetItem(item);
                      setDefaultItem(true);
                      setCalendarSetting(1);
                      setChangeName(``);
                      setItem(item);
                    }}
                  >
                    <div className={`${styles.calendar_name}`}>
                      <span style={{ background: `${item.color}` }}></span>
                      <em>{item.name}</em>
                    </div>
                    <ul className={`${styles.setting_list} ${styles.b}`}>
                      {/* 
                      <li
                        className={
                          groupListActive == 1 ? `${styles.active}` : null
                        }
                      >
                        <Link to="1" spy={true} smooth={true}>
                          <em
                            onClick={() => {
                              setGroupListActive(1);
                            }}
                          >
                            캘린더 설정
                          </em>
                        </Link>
                      </li>
                      */}
                      <li
                        className={
                          groupListActive == 1 ? `${styles.active}` : null
                        }
                      >
                        <Link to="5" spy={true} smooth={true}>
                          <em
                            onClick={() => {
                              setGroupListActive(2);
                            }}
                          >
                            캘린더 탈퇴
                          </em>
                        </Link>
                      </li>
                    </ul>
                  </li>
                );
              })}
          </ul>
        </div>
      </aside>
    </div>
  );
};

Index.propTypes = {
  privateCalendar: PropTypes.array,
  groupCalendars: PropTypes.array,
  targetItem: PropTypes.object,
  setTargetItem: PropTypes.func,
  defaultItem: PropTypes.bool,
  setDefaultItem: PropTypes.func,
  setCalendarSetting: PropTypes.func,
  setDefaultName: PropTypes.func,
  setChangeName: PropTypes.func,
  setItem: PropTypes.func,
  privateActive: PropTypes.number,
  setPrivateActive: PropTypes.func,
  groupActive: PropTypes.number,
  setGroupActive: PropTypes.func,
};

export default Index;
