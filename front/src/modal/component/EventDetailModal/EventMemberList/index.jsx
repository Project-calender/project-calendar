import React from 'react';
import PropTypes from 'prop-types';

import {
  faCheck,
  faQuestion,
  faUserGroup,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EVENT } from '../../../../store/events';
import EventMember from '../EventMember';

const Index = ({ isPrivateCalendar, eventHost, eventMembers }) => {
  const EVENT_STATE_KEY = Object.keys(EVENT.state);
  const EVENT_STATE = {
    accept: { message: '초대 수락', icon: faCheck },
    refuse: { message: '초대 거절', icon: faXmark },
    toBeDetermined: { message: '미정으로 응답', icon: faQuestion },
    default: { message: '회신 대기 중', icon: null },
  };

  const membersByState = eventMembers.reduce((membersByState, member) => {
    const state = member.EventMember.state;
    const stateKey = EVENT_STATE_KEY[state];
    return membersByState.set(stateKey, membersByState.get(stateKey) + 1);
  }, new Map(['accept', 'refuse', 'toBeDetermined', 'default'].map(state => [state, 0])));

  const memberStateTitle = [...membersByState.entries()]
    .map(([state, number]) =>
      number ? `${EVENT_STATE[state].message} ${number}명` : '',
    )
    .filter(text => text)
    .join(', ');

  if (!eventMembers.length) return;
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
          {(isPrivateCalendar
            ? [eventHost, ...eventMembers]
            : eventMembers
          ).map((member, index) => (
            <EventMember
              key={index}
              member={member}
              isHost={isPrivateCalendar && index === 0}
              EVENT_STATE={EVENT_STATE}
            />
          ))}
        </div>
      </div>
    </>
  );
};

Index.propTypes = {
  isPrivateCalendar: PropTypes.bool,
  eventHost: PropTypes.object,
  eventMembers: PropTypes.array,
};

export default Index;
