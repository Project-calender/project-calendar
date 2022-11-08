import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EVENT } from '../../../../store/events';

const Index = ({ member, isHost, EVENT_STATE }) => {
  const EVENT_STATE_KEY = Object.keys(EVENT.state);
  return (
    <div className={styles.user_info}>
      <div className={styles.user_profile}>
        <img src={member.ProfileImages[0].src} alt="profile" />
        {member.state ? (
          <FontAwesomeIcon
            className={`${styles.user_state} ${
              styles[EVENT_STATE_KEY[member.state]]
            }`}
            icon={EVENT_STATE[EVENT_STATE_KEY[member.state]].icon}
          />
        ) : null}
      </div>
      <div>
        <h3>{member.email}</h3>
        {isHost && <p className={styles.owner_title}>주최자</p>}
      </div>
    </div>
  );
};

Index.propTypes = {
  member: PropTypes.object,
  isHost: PropTypes.bool,
  EVENT_STATE: PropTypes.object,
};

export default Index;
