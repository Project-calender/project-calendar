import React, { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';

import Input from '../../../../components/common/Input';
import { checkEventInvite } from '../../../../store/thunk/event';
import { useDispatch, useSelector } from 'react-redux';
import { newEventSelector } from '../../../../store/selectors/newEvent';
import { selectAllCalendar } from '../../../../store/selectors/calendars';
import { updateNewEventBarProperties } from '../../../../store/newEvent';

const Index = () => {
  const [isDetail, setDetail] = useState(false);

  const dispatch = useDispatch();
  const newEvent = useSelector(newEventSelector);
  const calendars = useSelector(selectAllCalendar);

  async function handleInviteInput(e) {
    if (e.code !== 'Enter') return;
    const guestEmail = e.target.value;
    const member = await checkEventInvite({
      guestEmail,
      calendarId: calendars[newEvent.calendarId].id,
    });
    if (member.canInvite) {
      dispatch(
        updateNewEventBarProperties({
          inviteMembers: newEvent.inviteMembers.push(member),
        }),
      );
    }
  }

  if (!isDetail) {
    return (
      <div
        className={styles.invite_input}
        onClick={e => {
          setDetail(true);
          e.stopPropagation();
        }}
      >
        <FontAwesomeIcon icon={faUserGroup} />
        <div className={styles.invite_title}>
          <h4>참석자 추가</h4>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.invite_input}>
      <FontAwesomeIcon icon={faUserGroup} />

      <Input
        type="text"
        placeholder="참석자 추가"
        onKeyDown={handleInviteInput}
        autoFocus={isDetail}
        onBlur={e => {
          if (!e.target.value) setDetail(false);
        }}
      />
    </div>
  );
};

Index.propTypes = {
  showEventInfoListModal: PropTypes.func,
};

export default Index;
