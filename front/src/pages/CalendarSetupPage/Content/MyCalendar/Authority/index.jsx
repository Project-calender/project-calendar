import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CALENDAR_URL } from '../../../../../constants/api';
import axios from '../../../../../utils/token';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import {
  faPlus,
  faCaretDown,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import Invite from '../../Invite';
import Tooltip from '../../../../../components/common/Tooltip';

const Index = ({
  targetItem,
  calendarData,
  privateCalendar,
  setDefaultName,
  setAuthority,
}) => {
  let [groupUser, setGroupUser] = useState(); //그룹 유저 리스트
  let [groupUserIndex, setGroupUserIndex] = useState(); //그룹 유저 index 번호
  let [groupUserItem, setGroupUserItem] = useState(); //클릭한 그룹 유저 정보
  let [invitePopup, setInvitePopup] = useState(false); //팝업창 컨트롤
  let [owner, setOwner] = useState(); //소유자 있는지 여부 확인

  //멤버 강퇴
  function onExpulsion(item) {
    axios
      .post(`${CALENDAR_URL.SEND_OUT_USER}`, {
        calendarId: targetItem.id,
        userEmail: item.email,
      })
      .then(res => {
        console.log(`강퇴 성공`, res);
        calendarData();
      })
      .catch(error => {
        if (error.response.status == 400) {
          alert(`권한 부여는 달력의 오너만 가능합니다!`);
        } else if (error.response.status == 402) {
          alert(`존재하지 않는 유저입니다!`);
        } else if (error.response.status == 403) {
          alert(`그룹 캘린더에 존재하지 않는 유저입니다!`);
        } else if (error.response.status == 500) {
          alert(`서버 에러`);
        }
      });
  }

  //아이템 클릭시 권한 변경 axios 요청
  function onChangeAuthority(authority) {
    setGroupUserIndex(-1);
    axios
      .post(`${CALENDAR_URL.GIVE_AUTHORITY}`, {
        calendarId: targetItem.id,
        userEmail: groupUserItem.email,
        newAuthority: authority,
      })
      .then(() => {
        calendarData();
      })
      .catch(error => {
        if (error.response.status == 400) {
          alert(`권한 부여는 달력의 오너만 가능합니다!`);
        } else if (error.response.status == 402) {
          alert(`존재하지 않는 유저입니다!`);
        } else if (error.response.status == 403) {
          alert(`존재하지 않는 캘린더입니다!`);
        } else if (error.response.status == 405) {
          alert(`그룹 캘린더에 존재하지 초대되지 않은 유저입니다!`);
        } else if (error.response.status == 500) {
          alert(`서버 에러`);
        }
      });
  }

  //input 외부 클릭시 className 제거
  function clickModalOutside(event) {
    if (!setAuthority.current.contains(event.target)) {
      setGroupUserIndex(-1);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside);
    return () => {
      document.removeEventListener('mousedown', clickModalOutside);
    };
  });

  useEffect(() => {
    //소유자 계정 정보
    targetItem && targetItem.Owner ? setOwner(targetItem.Owner) : null;

    //소유자와 그룹원 중복 제거
    let privateFilter = privateCalendar.filter(e => {
      return e.id == targetItem?.id;
    });

    let groupArray = privateFilter[0]?.CalendarMembers;

    let groupFilter =
      groupArray &&
      groupArray.filter(a => {
        return a.email != targetItem.Owner.email;
      });

    setGroupUser(groupFilter);
    targetItem ? setDefaultName(targetItem.name) : null;

    return () => {
      setGroupUser(null);
    };
  }, [privateCalendar, targetItem]);

  return (
    <div id="2" className={styles.calendar_share}>
      <h3>특정 사용자와 공유</h3>
      <div className={styles.share_list}>
        <ul>
          {targetItem && targetItem.Owner ? (
            <li>
              <div className={styles.user}>
                <div className={styles.user_img}>
                  <img src={owner && owner.ProfileImages[0]?.src} alt="" />
                </div>
                <div className={styles.user_info}>
                  <p>{owner && owner.nickname}(소유자)</p>
                  <em>{owner && owner.email}</em>
                </div>
              </div>
            </li>
          ) : null}
          {groupUser &&
            groupUser.map((item, index) => {
              return (
                <li key={index}>
                  <div className={styles.user}>
                    <div className={styles.user_img}>
                      <img src={item.ProfileImages[0]?.src} alt="" />
                    </div>
                    <div className={styles.user_info}>
                      <p>{item.nickname}</p>
                      <em>{item.email}</em>
                    </div>
                  </div>
                  <div
                    className={
                      groupUserIndex == index
                        ? `${styles.active} ${styles.authority}`
                        : styles.authority
                    }
                  >
                    <button
                      className={styles.authority_btt}
                      onClick={e => {
                        setGroupUserItem(item);
                        setGroupUserIndex(
                          e.currentTarget.firstChild.textContent,
                        );
                      }}
                    >
                      <p className="ir_su">{index}</p>
                      {item.userAuthority.authority <= 1 ? (
                        <em>모든 일정 세부정보 보기</em>
                      ) : null}
                      {item.userAuthority.authority == 2 ? (
                        <em>일정 변경</em>
                      ) : null}
                      {item.userAuthority.authority == 3 ? (
                        <em>변경 및 공유 관리</em>
                      ) : null}
                      <FontAwesomeIcon icon={faCaretDown} />
                    </button>
                    <ul className={styles.authority_list}>
                      <li
                        onClick={() => {
                          onChangeAuthority(1);
                        }}
                      >
                        <em>모든 일정 세부정보 보기</em>
                      </li>
                      <li
                        onClick={() => {
                          onChangeAuthority(2);
                        }}
                      >
                        <em>일정 변경</em>
                      </li>
                      <li
                        onClick={() => {
                          onChangeAuthority(3);
                        }}
                      >
                        <em>변경 및 공유 관리</em>
                      </li>
                      <li
                        onClick={() => {
                          setGroupUserIndex(-1);
                        }}
                      >
                        <em>닫기</em>
                      </li>
                    </ul>
                  </div>
                  <div
                    className={styles.expulsion}
                    onClick={() => {
                      onExpulsion(item);
                    }}
                  >
                    <Tooltip title="캘린더 공유 취소">
                      <FontAwesomeIcon icon={faTimes} className={styles.icon} />
                    </Tooltip>
                  </div>
                </li>
              );
            })}
        </ul>
        <button
          className={styles.user_add_btt}
          onClick={() => {
            setInvitePopup(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} className={styles.plus_icon} />
          <em>사용자 추가</em>
        </button>
        {invitePopup == true ? (
          <Invite
            targetItem={targetItem}
            setInvitePopup={setInvitePopup}
          ></Invite>
        ) : null}
      </div>
    </div>
  );
};

Index.propTypes = {
  targetItem: PropTypes.object,
  calendarData: PropTypes.func,
  privateCalendar: PropTypes.array,
  defaultItem: PropTypes.bool,
  defaultName: PropTypes.string,
  setDefaultName: PropTypes.func,
  changeName: PropTypes.string,
  setChangeName: PropTypes.func,
  item: PropTypes.object,
  setAuthority: PropTypes.object,
};

export default Index;
