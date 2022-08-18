import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../../../components/common/Tooltip';
import { useDispatch } from 'react-redux';
import { removeInviteMember } from '../../../../store/newEvent';
const Index = ({ members }) => {
  const dispatch = useDispatch();
  function clickRemove(member) {
    dispatch(removeInviteMember(member));
  }
  return (
    <div>
      <div />
      <div className={styles.invite_members}>
        {Object.values(members).map(member => (
          <div key={member.id}>
            <div className={styles.invite_member}>
              <img
                src={
                  member.profileImage ||
                  `${process.env.PUBLIC_URL}/img/join/profile.png`
                }
              />
              <div className={styles.member_info}>
                <p>
                  {member.email} {!member.canInvite && <em>*</em>}
                </p>
                <em>{member.nickname}</em>
              </div>
            </div>
            <Tooltip title={'삭제'}>
              <FontAwesomeIcon
                icon={faXmark}
                className={styles.icon_delete}
                onClick={e => {
                  clickRemove(member);
                  e.stopPropagation();
                }}
              />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

Index.propTypes = {
  members: PropTypes.object,
};

export default Index;
