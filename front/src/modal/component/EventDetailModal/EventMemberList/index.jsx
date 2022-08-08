import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import {
  faCheck,
  faQuestion,
  faUserGroup,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Index = ({ eventMembers }) => {
  const EVENT_STATE_KEY = ['default', 'accept', 'toBeDetermined', 'refuse'];
  const EVENT_STATE = {
    accept: { message: '초대 수락', icon: faCheck },
    refuse: { message: '초대 거절', icon: faXmark },
    toBeDetermined: { message: '미정으로 응답', icon: faQuestion },
    default: { message: '회신 대기 중', icon: null },
  };

  const membersByState = eventMembers.reduce(
    (membersByState, member) => {
      membersByState[EVENT_STATE_KEY[member.EventMember.state]].push(member);
      return membersByState;
    },
    Object.keys(EVENT_STATE).reduce((membersByState, state) => {
      membersByState[state] = [];
      return membersByState;
    }, {}),
  );

  const memberStateTitle = Object.entries(membersByState)
    .map(([state, members]) =>
      members.length ? `${EVENT_STATE[state].message} ${members.length}명` : '',
    )
    .filter(text => text)
    .join(', ');

  return (
    <>
      <div>
        <FontAwesomeIcon icon={faUserGroup} />
        <div>
          <h3>참석자 {eventMembers.length}명</h3>
          <p>{memberStateTitle}</p>
        </div>
      </div>
      <div>
        <div />
        <div>
          {eventMembers.map(member => (
            <div key={member.id} className={styles.user_info}>
              <div className={styles.user_profile}>
                <img src={member.ProfileImages[0].src} alt="profile" />
                {member.EventMember.state ? (
                  <FontAwesomeIcon
                    className={`${styles.user_state} ${
                      styles[EVENT_STATE_KEY[member.EventMember.state]]
                    }`}
                    icon={
                      EVENT_STATE[EVENT_STATE_KEY[member.EventMember.state]]
                        .icon
                    }
                  />
                ) : null}
              </div>
              <h3>{member.email}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

Index.propTypes = {
  eventMembers: PropTypes.array,
};

export default Index;
