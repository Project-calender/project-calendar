import React, { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../../../components/common/Tooltip';
import { useDispatch } from 'react-redux';
import { removeInviteMember } from '../../../../store/newEvent';

const Index = ({ members }) => {
  const dispatch = useDispatch();
  function clickRemove(member) {
    dispatch(removeInviteMember(member));
  }

  const [helfModalPosition, setHelfModalStyle] = useState({});

  function moveHelfModal(e) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    if (helfModalPosition.top !== top)
      setHelfModalStyle({ top, left: left + 20, visibility: 'visible' });
  }

  const isExistCanNotInviteMember = Object.values(members).find(
    member => !member.canInvite,
  );

  return (
    <div>
      <div />
      <div className={styles.invite_members}>
        {Object.values(members).map(member => (
          <div key={member.id} className={styles.invite_member_container}>
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
                <li>
                  200명 이상의 참석자가 포함된 그룹을 초대했을 수 있습니다.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Index.propTypes = {
  members: PropTypes.object,
};

export default Index;
