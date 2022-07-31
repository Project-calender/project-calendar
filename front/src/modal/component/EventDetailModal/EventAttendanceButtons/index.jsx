import React, { useRef } from 'react';
import axios from '../../../../utils/token';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { EVENT_URL } from '../../../../constants/api';

const Index = ({ event }) => {
  const $groupButton = useRef();
  useEffect(() => {
    [...$groupButton.current.children].forEach($button => {
      $button.classList.toggle(
        styles.button_active,
        $button.value == event.state,
      );
    });
  }, [event]);

  async function changeEventInviteState(e) {
    if (!e.target.matches('button')) return;

    await axios.post(EVENT_URL.UPDATE_EVENT_INVITE_STATE, {
      invitedEventId: -event.id,
      state: e.target.value,
    });
    [...e.currentTarget.children].forEach($button => {
      $button.classList.toggle(
        styles.button_active,
        $button.value == e.target.value,
      );
    });
  }

  return (
    <div className={styles}>
      <em>참석 여부</em>
      <div ref={$groupButton} onClick={changeEventInviteState}>
        <button value={1}>예</button>
        <button value={3}>아니요</button>
        <button value={2}>미정</button>
      </div>
    </div>
  );
};

Index.propTypes = {
  event: PropTypes.object,
};

export default Index;
