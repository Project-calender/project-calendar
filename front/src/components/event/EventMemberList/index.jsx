import React, { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EVENT } from '../../../store/events';
import {
  faCheck,
  faClose,
  faQuestion,
  faQuestionCircle,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import Input from '../../common/Input';
const Index = ({ eventMembers }) => {
  console.log(eventMembers);
  const [helfModalPosition, setHelfModalStyle] = useState({});

  function moveHelfModal(e) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    if (helfModalPosition.top !== top)
      setHelfModalStyle({ top, left: left + 20, visibility: 'visible' });
  }

  const EVENT_STATE_KEY = Object.keys(EVENT.state);
  const EVENT_STATE = {
    accept: { message: '초대 수락', icon: faCheck },
    refuse: { message: '초대 거절', icon: faXmark },
    toBeDetermined: { message: '미정으로 응답', icon: faQuestion },
    default: { message: '회신 대기 중', icon: null },
  };

  const membersByState =
    Object.values(eventMembers).reduce(
      (membersByState, member) => {
        membersByState[EVENT_STATE_KEY[member.EventMember.state]].push(member);
        return membersByState;
      },
      Object.keys(EVENT_STATE).reduce((membersByState, state) => {
        membersByState[state] = [];
        return membersByState;
      }, {}),
    ) || {};

  const memberStateTitle = Object.entries(membersByState)
    .map(([state, members]) =>
      members.length ? `${EVENT_STATE[state].message} ${members.length}명` : '',
    )
    .filter(text => text)
    .join(', ');

  const isExistCanNotInviteMember = Object.values(eventMembers).find(
    member => !member.canInvite,
  );

  return (
    <div>
      <Input placeholder={'참석자 추가'} />
      <p>참석자 {Object.keys(eventMembers).length}명</p>
      <em>{memberStateTitle}</em>

      {Object.values(eventMembers).map(member => (
        <div key={member.id} className={styles.user_info}>
          <div className={styles.user_profile}>
            <img src={member.ProfileImages[0].src} alt="profile" />
            {member.EventMember.state ? (
              <FontAwesomeIcon
                className={`${styles.user_state} ${
                  styles[EVENT_STATE_KEY[member.EventMember.state]]
                }`}
                icon={
                  EVENT_STATE[EVENT_STATE_KEY[member.EventMember.state]].icon
                }
              />
            ) : null}
          </div>
          <h3>
            {member.email} {!member.canInvite && <em>*</em>}
            <FontAwesomeIcon icon={faClose} className={styles.icon_delete} />
          </h3>
        </div>
      ))}

      {isExistCanNotInviteMember && (
        <div className={styles.help_container}>
          <em>* 캘린더를 표시할 수 없습니다.</em>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className={styles.icon_help}
            onMouseOver={moveHelfModal}
            onMouseLeave={() => {
              setHelfModalStyle({ visibility: 'hidden' });
            }}
          />
          <div className={styles.help_modal} style={helfModalPosition}>
            <p>
              Google Calendar에서 다음 이유 중 하나로 인해 표시된 참석자를
              확인할 수 없습니다.
            </p>
            <ul>
              <li>참석자가 Google Calendar를 사용하지 않을 수 있습니다.</li>
              <li>표시된 캘린더에 엑세스할 권한이 없을 수도 있습니다.</li>
              <li>200명 이상의 참석자가 포함된 그룹을 초대했을 수 있습니다.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

Index.propTypes = {
  eventMembers: PropTypes.object,
};

export default Index;
