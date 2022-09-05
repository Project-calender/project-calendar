import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';

import Input from '../../../../components/common/Input';
import { checkCreateEventInvite } from '../../../../store/thunk/event';
import { useDispatch, useSelector } from 'react-redux';
import { newEventSelector } from '../../../../store/selectors/newEvent';
import { selectAllCalendar } from '../../../../store/selectors/calendars';
import { addInviteMember } from '../../../../store/newEvent';

const Index = () => {
  const [isDetail, setDetail] = useState(false);

  const dispatch = useDispatch();
  const newEvent = useSelector(newEventSelector);
  const calendars = useSelector(selectAllCalendar);

  useEffect(() => {
    if (!Object.keys(newEvent.inviteMembers).length) setDetail(false);
  }, [newEvent.inviteMembers]);

  async function handleInviteInput(e) {
    if (e.code !== 'Enter') return;
    const guestEmail = e.target.value;
    const member = await checkCreateEventInvite({
      guestEmail,
      calendarId: calendars[newEvent.calendarId].id,
    });

    dispatch(addInviteMember(member));
    e.target.value = '';
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
        onBlur={() => {
          if (!Object.keys(newEvent.inviteMembers).length) setDetail(false);
        }}
      />
    </div>
  );
};

Index.propTypes = {
  showEventInfoListModal: PropTypes.func,
};

export default Index;
