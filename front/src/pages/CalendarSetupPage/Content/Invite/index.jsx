import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import { useState } from 'react';
import { useRef } from 'react';
import axios from '../../../../utils/token';
import { CALENDAR_URL } from '../../../../constants/api';
import usePopupClose from '../../../../hooks/usePopupClose';

const Index = ({ targetItem, setInvitePopup }) => {
  let popup = useRef(); //팝업창 dom
  let authorityList = useRef(); //권한 설정 dom
  let [authorityActive, setAuthorityActive] = useState(false); //권한 설정 className 추가 컨트롤
  let [userEmail, setUserEmail] = useState(``); //초대 받는 유저 이메일 저장
  const userEmailCheck = userEmail.includes('@') && userEmail.includes('.'); //초대 받는 유저 이메일 체크 /이메일 @와 .이 들어가는지 체크
  let [authority, setAuthority] = useState(3); //권한 저장
  let [authorityText, setAuthorityText] = useState(`모든 일정 세부정보 보기`);
  let popupClose = usePopupClose(popup);

  //사용자 그룹 캘린더 초대
  function onInvite() {
    // console.log('초대 받는 사람 이메일', userEmail);
    // console.log('캘린더 id', targetItem.id);
    // console.log('권한', authority);
    axios
      .post(`${CALENDAR_URL.INVITE_CALENDAR}`, {
        guestEmail: userEmail,
        calendarId: targetItem.id,
        authority: authority,
      })
      .then(res => {
        console.log('초대 성공', res);
        setInvitePopup(false);
        alert('초대를 완료 했습니다.');
      })
      .catch(error => {
        if (error.response.status == 400) {
          alert(`권한이 없습니다!`);
        } else if (error.response.status == 402) {
          alert(`존재하지 않는 유저입니다!`);
        } else if (error.response.status == 403) {
          alert(`이미 해당 달력에 초대장을 보낸 상대입니다!`);
        } else if (error.response.status == 405) {
          alert(`이미 캘린더의 그룹원 입니다!`);
        } else if (error.response.status == 500) {
          alert(`서버 에러`);
        }
      });
  }

  return (
    <div
      className={styles.container}
      onClick={() => {
        setInvitePopup(popupClose);
      }}
    >
      <div className={styles.invite_popup} ref={popup}>
        <h2>특정 사용자와 공유</h2>
        <form
          className={styles.invite_form}
          onClick={e => {
            e.preventDefault();
          }}
        >
          <div className={styles.user_email}>
            <input
              type="text"
              placeholder="이메일 추가"
              onChange={e => {
                setUserEmail(e.target.value);
              }}
            />
          </div>
          <div
            ref={authorityList}
            className={styles.user_authority}
            onClick={() => {
              setAuthorityActive(true);
            }}
          >
            <em>권한</em>
            <p>{authorityText}</p>
            <FontAwesomeIcon icon={faCaretDown} className={styles.down_icon} />
            <ul
              className={
                authorityActive == true
                  ? `${styles.authority_list} ${styles.active}`
                  : styles.authority_list
              }
            >
              <li
                onClick={e => {
                  e.stopPropagation();
                  setAuthority(3);
                  setAuthorityActive(false);
                  setAuthorityText(`모든 일정 세부정보 보기`);
                }}
              >
                <em>모든 일정 세부정보 보기</em>
              </li>
              <li
                onClick={e => {
                  e.stopPropagation();
                  setAuthority(2);
                  setAuthorityActive(false);
                  setAuthorityText(`일정 변경`);
                }}
              >
                <em>일정 변경</em>
              </li>
              <li
                onClick={e => {
                  e.stopPropagation();
                  setAuthority(1);
                  setAuthorityActive(false);
                  setAuthorityText(`변경 및 공유 관리`);
                }}
              >
                <em>변경 및 공유 관리</em>
              </li>
            </ul>
          </div>
          <div className={styles.btt_wrap}>
            <button
              className={styles.close}
              onClick={e => {
                e.stopPropagation();
                setInvitePopup(false);
              }}
              type="button"
            >
              취소
            </button>
            {userEmailCheck == true ? (
              <button
                className={styles.send}
                onClick={() => {
                  onInvite();
                }}
              >
                보내기
              </button>
            ) : (
              <button className={`${styles.send} ${styles.inactive}`}>
                보내기
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

Index.propTypes = {
  targetItem: PropTypes.object,
  setInvitePopup: PropTypes.func,
};

export default Index;
